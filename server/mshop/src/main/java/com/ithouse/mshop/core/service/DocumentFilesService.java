package com.ithouse.mshop.core.service;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.ithouse.mshop.core.entity.DocumentFiles;
import com.ithouse.mshop.core.entity.User;
import com.ithouse.mshop.core.repository.DocumentFilesRepo;
import com.ithouse.mshop.core.utils.DocumentFileUtils;
import com.ithouse.mshop.core.utils.FileType;

@Service
public class DocumentFilesService {
	private static final Logger log = LoggerFactory.getLogger(DocumentFilesService.class);

	@Value("${file.profile.image.save.dir}")
	private String profileImagePath;

	@Autowired
	private DocumentFilesRepo documentFilesRepo;

	@Autowired
	private UserService userService;

	Gson json;
	{
		json = new Gson();
	}

	public void saveFile(List<MultipartFile> files, FileType fileType, Long userId, String appName, String objectName) {
		User loginUser = userService.findUser(userId, appName);
		try {
			if (!files.isEmpty() && loginUser != null) {
				for (MultipartFile multipartFile : files) {
					DocumentFiles documentFiles = saveDocument(multipartFile, userId, fileType, objectName);
					if (StringUtils.equals(fileType.toString(), FileType.PROFILE.toString())) {
						loginUser.setProfileImagePath(documentFiles.getFilePath());
					} else if (StringUtils.equals(fileType.toString(), FileType.PROFILE_BANNER.toString())) {
						loginUser.setProfileBannerPath(documentFiles.getFilePath());
					}
					userService.saveInitialValue(loginUser);
				}

			}
		} catch (Exception e) {
			log.info("getting error: [{}]", e.getMessage());

		}
	}

	private DocumentFiles saveDocument(MultipartFile multipartFile, Long userId, FileType fileType, String objectName)
			throws Exception {
		DocumentFiles documentFiles = new DocumentFiles();
		String path = DocumentFileUtils.saveFile2Dir(multipartFile, profileImagePath, false);
		documentFiles.setFilePath(path);
		documentFiles.setFileName(multipartFile.getOriginalFilename());
		documentFiles.setCreateDate(new Date());
		documentFiles.setFileType(fileType);
		documentFiles.setObjectId(userId);
		documentFiles.setObjectType(objectName);
		documentFiles.setCreateDate(new Date());
		documentFiles.setCreatorId(userId);

		return documentFilesRepo.save(documentFiles);
	}

	public User buildUserImage(Long userId, String appName) throws IOException {
		User dbUser = userService.findUser(userId, appName);
		if (!StringUtils.isEmpty(dbUser.getProfileImagePath())) {
			dbUser.setProfileImagePath(DocumentFileUtils.file2Base64(dbUser.getProfileImagePath()));
		}
		if (!StringUtils.isEmpty(dbUser.getProfileBannerPath())) {
			dbUser.setProfileBannerPath(DocumentFileUtils.file2Base64(dbUser.getProfileBannerPath()));
		}

		return dbUser;
	}

}
