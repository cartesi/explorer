target "docker-metadata-action" {}

variable "LOCAL_DEV" {
    default = true
}

variable "WC_PROJECT_ID" {
    default = "$WC_PROJECT_ID"
}

variable "INFURA_PROJECT_ID" {
    default = "$INFURA_PROJECT_ID"
}

variable "SEPOLIA_GRAPHQL_URL" {
    default= "$SEPOLIA_GRAPHQL_URL"
}

variable "ARB_GOERLI_GRAPHQL_URL" {
    default= "$ARB_GOERLI_GRAPHQL_URL"
}

target default {    
    inherits = ["docker-metadata-action"]
    dockerfile = "Dockerfile-rollups"
    args = {
        WC_PROJECT_ID = "${WC_PROJECT_ID}"
        INFURA_PROJECT_ID = "${INFURA_PROJECT_ID}"
        LOCAL_DEV = "${LOCAL_DEV}"
        ARB_GOERLI_GRAPHQL_URL = "${ARB_GOERLI_GRAPHQL_URL}"
        SEPOLIA_GRAPHQL_URL = "${SEPOLIA_GRAPHQL_URL}"
    }
    platforms = ["linux/amd64", "linux/arm64"]
}

