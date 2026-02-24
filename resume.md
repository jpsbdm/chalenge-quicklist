# 🏠 Home Server — Documentação

> Documentação completa do home server rodando Proxmox com Home Assistant OS, câmeras Tapo via Frigate, e stack de mídia completa.

-----

## 🖥️ Hardware

|Componente |Detalhe                        |
|-----------|-------------------------------|
|Servidor   |HP Z220 Workstation            |
|CPU        |Intel Xeon E3-1245 V2 @ 3.40GHz|
|RAM        |32GB                           |
|GPU        |NVIDIA Quadro K620             |
|SSD Sistema|223.6GB (Proxmox + VMs)        |
|SSD Dados  |1.9TB (ZFS Pool - MyPool)      |

-----

## 🌐 Rede

|Dispositivo           |IP           |Observação                        |
|----------------------|-------------|----------------------------------|
|Roteador principal    |192.168.1.1  |Gateway                           |
|AP (Access Point)     |192.168.1.101|Modo AP                           |
|Proxmox               |192.168.1.108|Acesso: https://192.168.1.108:8006|
|Home Assistant OS     |192.168.1.140|Acesso: http://192.168.1.140:8123 |
|Ubuntu Media Server   |192.168.1.141|SSH: media@192.168.1.141          |
|Câmera C320WS (jardim)|192.168.1.131|Tapo C320WS                       |
|Câmera C210 (driveway)|192.168.1.107|Tapo C210                         |
|Câmera C210 (sala)    |192.168.1.103|Tapo C210                         |

-----

## 🔧 Proxmox

- **Versão:** 9.1.1
- **Usuário:** root
- **Acesso:** https://192.168.1.108:8006

### VMs

|ID |Nome         |OS          |IP           |RAM|Cores|Disco|
|---|-------------|------------|-------------|---|-----|-----|
|100|homeassistant|HAOS 17.1   |192.168.1.140|2GB|2    |32GB |
|101|mediaserver  |Ubuntu 24.04|192.168.1.141|4GB|4    |32GB |

### ZFS Pool

```
Pool: MyPool
Disco: /dev/sda (1.9TB)
Mountpoint: /MyPool

Datasets relevantes:
/MyPool/TV              → 547GB - Mídia (filmes e séries)
/MyPool/configs/plex    → Config Plex
/MyPool/configs/qbittorrent → Config qBittorrent
```

Datasets montados no Proxmox:

```
/mnt/media         → MyPool/TV
/mnt/plex          → MyPool/configs/plex
/mnt/qbittorrent   → MyPool/configs/qbittorrent
```

> ⚠️ O pool ZFS precisa ser importado após reboot do Proxmox:
> 
> ```bash
> zpool import -f MyPool
> ```

-----

## 🏠 Home Assistant OS

- **Versão:** HAOS 17.1 / HA Core 2026.2.3
- **Acesso:** http://192.168.1.140:8123
- **VM ID:** 100

### Integrações configuradas

|Integração       |Status|Observação                            |
|-----------------|------|--------------------------------------|
|Philips Hue      |✅     |Luzes: sala, quarto, cozinha, corredor|
|Alexa (Nabu Casa)|✅     |$7/mês — cloud.nabucasa.com           |
|ONVIF (câmeras)  |✅     |C320WS funcionando                    |
|Frigate          |✅     |Addon instalado, gravação ativa       |

### Cenas criadas

|Cena      |Comando Alexa            |
|----------|-------------------------|
|Modo Filme|“Alexa, ativa modo filme”|

### Frigate

- **Versão:** 0.16.4
- **Interface:** http://192.168.1.140:5000
- **Config:** `/config/config.yml` (editável via Studio Code Server)
- **Detector:** CPU (detecção desabilitada para economizar recursos)
- **Stream:** stream2 (baixa qualidade) nas 3 câmeras

```yaml
# Câmeras configuradas com stream2, detecção desabilitada
# URLs formato: rtsp://joaopedro:SENHA@IP:554/stream2
cameras:
  camera_driveway: 192.168.1.107
  camera_jardim:   192.168.1.131
  camera_sala:     192.168.1.103
```

> ⚠️ As câmeras usam `stream2` (não `stream1`) — stream1 retorna “Operation not permitted”
> ⚠️ Credenciais ONVIF: usuário `joaopedro` — **TROCAR A SENHA POR SEGURANÇA**

-----

## 📺 Stack de Mídia (Ubuntu 192.168.1.141)

- **Usuário:** media
- **Docker Compose:** `~/mediaserver/docker-compose.yml`

### Serviços

|Serviço    |URL                           |Porta|Função               |
|-----------|------------------------------|-----|---------------------|
|Plex       |http://192.168.1.141:32400/web|32400|Streaming            |
|Jellyfin   |http://192.168.1.141:8096     |8096 |Streaming            |
|qBittorrent|http://192.168.1.141:8080     |8080 |Downloads            |
|Radarr     |http://192.168.1.141:7878     |7878 |Gerenciador de Filmes|
|Sonarr     |http://192.168.1.141:8989     |8989 |Gerenciador de Séries|
|Prowlarr   |http://192.168.1.141:9696     |9696 |Indexer Manager      |

### Volumes

|Container  |Config          |Mídia                 |
|-----------|----------------|----------------------|
|Plex       |/mnt/plex       |/mnt/media            |
|Jellyfin   |/mnt/jellyfin   |/mnt/media            |
|qBittorrent|/mnt/qbittorrent|/mnt/media (downloads)|
|Radarr     |/mnt/radarr     |/mnt/media            |
|Sonarr     |/mnt/sonarr     |/mnt/media            |

### Tracker

- **Prowlarr:** BJ-Share configurado (Full Sync com Radarr e Sonarr)

### Comandos úteis

```bash
# Ver status dos containers
cd ~/mediaserver && docker compose ps

# Reiniciar stack
docker compose restart

# Ver logs de um container
docker logs plex -f

# Parar tudo
docker compose down

# Subir tudo
docker compose up -d
```

-----

## 🔌 Comandos Proxmox úteis

```bash
# Ver VMs
qm list

# Iniciar VM
qm start 100

# Ver status ZFS
zpool status
zfs list

# Importar pool após reboot
zpool import -f MyPool
```

-----

## 📋 Pendências / TODO

- [ ] Configurar gravação contínua no Frigate (precisa do SSD 2TB montado na VM HAOS)
- [ ] Ativar detecção de pessoas no Frigate usando GPU (passthrough da Quadro K620)
- [ ] Adicionar câmeras ONVIF no dashboard do HA
- [ ] Configurar pasta de downloads por categoria no qBittorrent (Filmes/TV)
- [ ] Configurar pasta raiz no Radarr e Sonarr apontando para /mnt/media
- [ ] OctoPrint para impressora 3D
- [ ] Configurar backup das VMs no Proxmox
- [ ] Trocar senha ONVIF das câmeras Tapo
- [ ] Resolver IP fixo permanente para HAOS via DHCP reservation no roteador (MAC: BC:24:11:40:CF:9F)

-----

## 🔐 Segurança

> ⚠️ **ATENÇÃO:** Trocar as seguintes senhas assim que possível:
> 
> - Senha ONVIF das câmeras Tapo (usuário: joaopedro)
> - Senha do qBittorrent Web UI
> - Verificar se Frigate está acessível externamente

-----

## 📅 Histórico

|Data    |O que foi feito                                                    |
|--------|-------------------------------------------------------------------|
|Fev 2026|Instalação Proxmox 9.1.1 no HP Z220                                |
|Fev 2026|HAOS 17.1 instalado como VM (ID 100)                               |
|Fev 2026|Philips Hue e Alexa via Nabu Casa configurados                     |
|Fev 2026|Câmeras Tapo C210/C320WS configuradas via Frigate                  |
|Fev 2026|ZFS pool do TrueNAS importado (547GB de mídia preservados)         |
|Fev 2026|VM Ubuntu 24.04 criada para stack de mídia                         |
|Fev 2026|Docker stack: Plex, Jellyfin, qBittorrent, Radarr, Sonarr, Prowlarr|
|Fev 2026|BJ-Share adicionado no Prowlarr com sync para Radarr e Sonarr      |
