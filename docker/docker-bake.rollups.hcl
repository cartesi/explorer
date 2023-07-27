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

target default {    
    inherits = ["docker-metadata-action"]
    dockerfile = "Dockerfile-rollups"
    args = {
        WC_PROJECT_ID = "${WC_PROJECT_ID}"
        INFURA_PROJECT_ID = "${INFURA_PROJECT_ID}"
        LOCAL_DEV = "${LOCAL_DEV}"
    }
    platforms = ["linux/amd64", "linux/arm64"]
}

