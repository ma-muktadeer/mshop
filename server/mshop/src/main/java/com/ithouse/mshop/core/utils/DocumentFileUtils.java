package com.ithouse.mshop.core.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.multipart.MultipartFile;

public class DocumentFileUtils {

	public static Resource getFileAsResource(String path) {
		try {
			Path filePath = Paths.get(path);
			return new UrlResource(filePath.toUri());
		} catch (Exception e) {
			return null;
		}
	}

    public static String file2Base64(String filePath) throws IOException {
        byte[] fileContent = FileUtils.readFileToByteArray(new File(filePath));
        return getFileType(filePath) + Base64.getEncoder().encodeToString(fileContent);
    }

    private static String getFileType(String filePath) {
        return "data:image/" + filePath.substring(filePath.lastIndexOf(".") +1) + ";base64,";
    }
    
    public static String saveFile2Dir(MultipartFile file, String basePath, boolean isUseUUID) throws Exception {
		Utils.makDir(basePath);
		String fileName = file.getOriginalFilename();

		if(isUseUUID) {
			fileName = UUID.randomUUID().toString().replaceAll("-", "") + fileName.substring(fileName.lastIndexOf("."));
		}

		String destPath = basePath + File.separator + fileName;
		File destFile = new File(destPath);
		file.transferTo(destFile);

		return destPath;
	}
    
}
