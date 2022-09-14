package com.sap.sample.ldap.utils;

import java.util.Optional;

public final class EnvironmentUtils {

	private EnvironmentUtils() {
		throw new AssertionError("Unsupported operation");
	}

	public static Optional<String> getEnvironmentVariable(String environmentVariable) {
		return Optional.ofNullable(System.getenv(environmentVariable));
	}
}
