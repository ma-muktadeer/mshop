//package com.ithouse.mshop;
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;
//
//import javax.imageio.ImageIO;
//import java.awt.*;
//import java.awt.image.BufferedImage;
//import java.io.File;
//import java.io.IOException;
//import java.net.URI;
//import java.net.URL;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Locale;
//import java.util.concurrent.*;
//import java.util.concurrent.atomic.AtomicInteger;
//
//public class OSMTileDownloader {
//    private static final Logger log = LogManager.getLogger();
//    private static final String BASE_DIR = "D:\\my git\\tst-mp\\src\\assets\\tiles\\bangladesh-tiles1";
//
//    // Approximate bounding box for Bangladesh
//    private static final double LAT_MIN = 20.55;  // South
//    private static final double LAT_MAX = 26.63;  // North
//    private static final double LON_MIN = 88.02;  // West
//    private static final double LON_MAX = 92.68;  // East
//
//    private static final int MIN_ZOOM = 6;
//    private static final int MAX_ZOOM = 12;
//    public static void main(String[] args) throws InterruptedException {
//        // Iterate over zoom levels 6 to 12
//        for (int zoom = MIN_ZOOM; zoom <= MAX_ZOOM; zoom++) {
//            log.info("Downloading tiles for zoom level {}", zoom);
//
//            int[] tileMin = latLonToTileXY(LAT_MAX, LON_MIN, zoom); // NW corner
//            int[] tileMax = latLonToTileXY(LAT_MIN, LON_MAX, zoom); // SE corner
//
//            int xMin = Math.min(tileMin[0], tileMax[0]);
//            int xMax = Math.max(tileMin[0], tileMax[0]);
//            int yMin = Math.min(tileMin[1], tileMax[1]);
//            int yMax = Math.max(tileMin[1], tileMax[1]);
//
//            List<Callable<Void>> tasks = new ArrayList<>();
//
//            AtomicInteger downloadedCount = new AtomicInteger(0);
//            AtomicInteger skippedCount = new AtomicInteger(0);
//            AtomicInteger failedCount = new AtomicInteger(0);
//
//            for (int x = xMin; x <= xMax; x++) {
//                for (int y = yMin; y <= yMax; y++) {
//                    final int tx = x;
//                    final int ty = y;
//                    final int xZoom = zoom;
//
//                    tasks.add(() -> {
//                        Path filePath = Path.of(BASE_DIR, String.valueOf(xZoom), String.valueOf(tx), ty + ".png");
//
//                        if (Files.exists(filePath)) {
//                            log.info("⏭️ Skip tile {}/{}/{}.png", xZoom, tx, ty);
//                            skippedCount.incrementAndGet();
//                            return null;
//                        }
//
//                        BufferedImage tile = downloadTile(tx, ty, xZoom);
//                        if (tile != null) {
//                            saveTile(tile, xZoom, tx, ty);
//                            log.info("✅ Saved tile {}/{}/{}.png", xZoom, tx, ty);
//                            downloadedCount.incrementAndGet();
//                        } else {
//                            failedCount.incrementAndGet();
//                        }
//
//                        return null;
//                    });
//                }
//            }
//            try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
//                executor.invokeAll(tasks);
//                log.info("🔍 Zoom {} Summary:\n", zoom);
//                log.info("   ✅ Downloaded: {}\n", downloadedCount.get());
//                log.info("   ⏭️  Skipped:    {}\n", skippedCount.get());
//                log.info("   ❌ Failed:     {}\n", failedCount.get());
//                log.info("--------------------------------------");
//            }
//
//            log.info("✅ All tiles for zoom level {} downloaded and saved.", zoom);
//        }
//
//        log.info("✅ All tiles for zoom levels 6 to 12 downloaded and saved.");
//    }
//
//    public static int[] latLonToTileXY(double lat, double lon, int zoom) {
//        int xtile = (int) Math.floor((lon + 180) / 360 * (1 << zoom));
//        int ytile = (int) Math.floor(
//                (1 - Math.log(Math.tan(Math.toRadians(lat)) + 1 / Math.cos(Math.toRadians(lat))) / Math.PI) / 2 * (1 << zoom)
//        );
//        return new int[]{xtile, ytile};
//    }
//
//    public static BufferedImage downloadTile(int x, int y, int z) {
//        String urlStr = String.format(Locale.US, "https://tile.openstreetmap.org/%d/%d/%d.png", z, x, y);
//        try {
//            URL url = URI.create(urlStr).toURL();
//            var connection = url.openConnection();
//            connection.setRequestProperty("User-Agent", "BangladeshTileDownloader/1.0 (+https://yourdomain.com)");
//
//            try (var input = connection.getInputStream()) {
//                return ImageIO.read(input);
//            }
//
//        } catch (IOException e) {
//            log.error("❌ Failed to download tile {}/{}/{}: {}", z, x, y, e.getMessage());
//            return null;
//        }
//    }
//
//    public static void saveTile(BufferedImage tile, int z, int x, int y) {
//        try {
//
//            File dir = new File(BASE_DIR + File.separator + z + File.separator + x);
//            if (!dir.exists()) {
//                dir.mkdirs();
//            }
//            File file = new File(dir, y + ".png");
//            ImageIO.write(tile, "png", file);
//        } catch (IOException e) {
//            log.error("❌ Failed to save tile {}/{}/{}: {}%n", z, x, y, e.getMessage());
//        }
//    }
//}
