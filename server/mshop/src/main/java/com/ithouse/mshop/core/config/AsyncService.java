//package com.ithouse.mshop.core.config;
//
//import java.util.concurrent.CompletableFuture;
//import java.util.concurrent.TimeUnit;
//import java.util.concurrent.TimeoutException;
//
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.scheduling.annotation.AsyncConfigurer;
//import org.springframework.scheduling.annotation.EnableAsync;
//import org.springframework.stereotype.Service;

//@Service
//@EnableAsync
//public class AsyncService implements AsyncConfigurer {
//
//	@Async("taskExecutor")
//	public CompletableFuture<String> processAsyncTaskWithTimeout() {
//		CompletableFuture<String> future = new CompletableFuture<>();
//
//		CompletableFuture.runAsync(() -> {
//			try {
//				// Simulate a long-running task
//				Thread.sleep(10000);
//				future.complete("Task completed");
//			} catch (InterruptedException e) {
//				Thread.currentThread().interrupt();
//				future.completeExceptionally(e);
//			}
//		});
//
//		return future.orTimeout(30, TimeUnit.SECONDS).exceptionally(ex -> {
//			if (ex instanceof TimeoutException) {
//				return "Task timed out";
//			} else {
//				return "Task failed: " + ex.getMessage();
//			}
//		});
//	}
//}