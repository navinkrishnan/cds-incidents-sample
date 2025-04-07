module.exports = {
    "cds": {
        "requires": {
            "auth": {
                "[development]": {
                    "users": {
                        "alice": {
                            "roles": [
                                "support",
                                "admin"
                            ]
                        },
                        "bob": {
                            "roles": [
                                "support"
                            ]
                        }
                    }
                }
            }
        }
    }
}