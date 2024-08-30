# GitHub-Asana Integration Service

This project provides a service that integrates GitHub and Asana. Whenever a new issue is created on a GitHub repository, a corresponding task is automatically created in Asana with the issue's details. The service is built using Node.js, Express, and Axios, without relying on pre-built Asana packages.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Configuration](#configuration)
- [Running the Service](#running-the-service)
- [Testing the Integration](#testing-the-integration)
- [Troubleshooting](#troubleshooting)

## Features

- Automatically creates a task in Asana for each new issue opened in GitHub.
- Uses GitHub Webhooks to listen for new issues.
- Validates GitHub webhook signatures to ensure security.
- Uses the Asana REST API to create tasks in Asana.

## Prerequisites

- [Node.js](https://nodejs.org/en/) installed on your system.
- A GitHub account with a repository where you can create issues.
- An Asana account with a workspace to create tasks.
- [LocalTunnel](https://theboroer.github.io/localtunnel-www/) or [Ngrok](https://ngrok.com/) for exposing your localhost to the internet (to receive GitHub webhooks).

## Setup and Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/github-asana-integration.git
   cd github-asana-integration
   ```
