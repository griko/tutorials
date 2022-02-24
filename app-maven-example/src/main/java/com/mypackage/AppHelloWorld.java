package com.mypackage;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class AppHelloWorld {
    private static final Logger logger = LogManager.getLogger(AppHelloWorld.class);
    public static void main(String[] args) {
        logger.warn("Hi from log4j");

    }
}
