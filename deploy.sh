
#!/bin/bash

# To create a SFTP user in Ionos, go to Hosting -> SFTP

source .env
# Build
vite build

# Upload to Ionos through lftp
lftp -u $IONOS_USER,$IONOS_PASS sftp://$IONOS_HOST <<EOF
set sftp:auto-confirm yes
set net:timeout 10
debug 3
mirror -R dist .
bye
EOF

rm -r dist

echo "Deployment complete"