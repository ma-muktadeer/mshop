package com.ithouse.mshop.core.utils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public final class AppUtils {

	public static <T> List<T> toList(final Iterable<T> iterable) {
	    return StreamSupport.stream(iterable.spliterator(), false)
	                        .collect(Collectors.toList());
	}

}
