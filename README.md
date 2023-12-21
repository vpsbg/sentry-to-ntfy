# 📢 Sentry-to-Ntfy integration

[Sentry](https://github.com/getsentry/sentry) - Sentry is a developer-first error tracking and performance monitoring platform

[Ntfy](https://github.com/binwiederhier/ntfy) - With ntfy, you can send notifications to your phone or desktop via scripts from any computer, without having to sign up or pay any fees.

## Description
This simple software is starting a webserver which is ready to accept webhooks from Sentry, process them and send alerts via Ntfy.

## Requirements
- Docker
- Sentry
- Ntfy
- Registered Sentry (private) integration


Both Sentry and Ntfy can be self-hosted on [any cloud server](https://www.vpsbg.eu/kvm-vps)   you like. Here are the guides:
- [Installing Ntfy server](https://docs.ntfy.sh/install/)
- [Installing Sentry](https://develop.sentry.dev/self-hosted/)

## Setup
### 1. Integration registration
You need to create a new Sentry integration.  
Navigate to: **Settings >> Integrations >> Create new integration >> Internal integration**.
1. Set a name.
2. The webhook is the URL to the server where you will host this software. This software by default listens on port 5000 and expects a POST request to /webhook endpoint.  
For example: **http://SERVER_IP:5000/webhook**
4. Give "Read" permissions to "Issue & Event".
5. In the "Webhook" section, check the "Issue" section.
6. Save the integration.
7. Open the integration and find the section "Credentials" and copy the "Client Secret". You will need to put this secret key in the `.env` file.


### 2. Setup
1. Clone this repository.
2. Copy the file `.env.example` to `.env` and edit the variables as follows:
    - NTFY_URL: Full URL to your ntfy server and the topic. Example: https://ntfy.sh/example_topic
    - NTFY_USERNAME: Username, if authentication is used
    - NTFY_PASSWORD: Password, if authentication is used
    - SENTRY_CLIENT_SECRET: Client secret. You can take that when you register the integration via Sentry.
3. Run the docker container using this command:
```bash
docker run -d --name sentry-to-ntfy --env-file .env -p 5000:5000 vpsbg/sentry-to-ntfy
```
4. Test the integration by sending a test alert from Sentry.

## Security Concerns
- **Use SSL/TLS**: It's highly recommended to use a reverse proxy with SSL/TLS encryption. Avoid using HTTP for sensitive data.
- **Environment Variables**: Securely manage your `.env` file, and never expose it publicly.
- **IP firewall**: Restrict access to this endpoint/IP to only allow connections from Sentry and block all other unauthorized sources.

## Contributing
Contributions are welcome. Please fork the repository and submit a pull request.

## License
This repository is licensed under the MIT License. You can find more information in the [LICENSE](https://en.wikipedia.org/wiki/MIT_License) file.

[VPSBG.eu](https://www.vpsbg.eu)
