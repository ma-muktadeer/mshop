package com.ithouse.mshop.core.entity;

import com.ithouse.mshop.core.model.BaseEntity;
import com.ithouse.mshop.core.utils.FileType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name="T_DOCUMENT_FILES")
public class DocumentFiles extends BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "FILES_GEN") //for oracle
	@SequenceGenerator(sequenceName = "FILES_GEN", allocationSize = 1, name = "FILES_GEN") //for oracle
	@Column(name = "id_document_files_key")
	private Long documetnFilesId;
	
//	DOCUMENTS_FILES_GEN
	@Column(name = "tx_group")
	private Long group;
	
	//ATTACHEMENT, UPLOADED
	@Column(name = "tx_source")
	@Enumerated(EnumType.STRING)
	private FileType fileType;
	
	@Column(name = "tx_file_name")
	private String fileName;
	
	@Column(name = "tx_note")
	private String note;
	
	@Column(name = "tx_file_path")
	private String filePath;
	
	//INSTRUCTION,TASK
	@Column(name = "id_object_key")
	private Long objectId;
	
	
	//INSTRUCTION,TASK
	@Column(name = "tx_object_type")
	private String objectType;
	
	
	public Long getDocumetnFilesId() {
		return documetnFilesId;
	}


	public void setDocumetnFilesId(Long documetnFilesId) {
		this.documetnFilesId = documetnFilesId;
	}


	public Long getGroup() {
		return group;
	}


	public void setGroup(Long group) {
		this.group = group;
	}


	public FileType getFileType() {
		return fileType;
	}


	public void setFileType(FileType fileType) {
		this.fileType = fileType;
	}


	public String getFileName() {
		return fileName;
	}


	public void setFileName(String fileName) {
		this.fileName = fileName;
	}


	public String getNote() {
		return note;
	}


	public void setNote(String note) {
		this.note = note;
	}


	public String getFilePath() {
		return filePath;
	}


	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}


	public Long getObjectId() {
		return objectId;
	}


	public void setObjectId(Long objectId) {
		this.objectId = objectId;
	}


	public String getObjectType() {
		return objectType;
	}


	public void setObjectType(String objectType) {
		this.objectType = objectType;
	}


	
}
