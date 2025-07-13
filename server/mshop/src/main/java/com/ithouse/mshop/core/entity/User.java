package com.ithouse.mshop.core.entity;

import com.ithouse.mshop.core.model.BaseEntity;
import jakarta.persistence.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "T_USER")
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USER_SEQ_GEN") // for oracle
    // @SequenceGenerator(sequenceName = "USER_SEQ", allocationSize = 1, name = "USER_SEQ_GEN") // for oracle
    @Column(name = "id_user_key")
    private Long userId;

    @Column(name = "id_user_ver")
    private Integer userVer;

    @Column(name = "tx_app_name", length = 36, nullable = false)
    private String appName;

    @Column(name = "tx_first_name", length = 56)
    private String firstName;

    @Column(name = "tx_middle_name", length = 56)
    private String middleName;

    @Column(name = "tx_last_name", length = 56)
    private String lastName;

    @Column(name = "tx_full_name", length = 120)
    private String fullName;

    @Column(name = "dtt_dob")
    private Date dob;

    @Column(name = "tx_country")
    private String country = "Bangladesh";

    @Column(name = "tx_phone_number", length = 16)
    private String phoneNumber;

    @Column(name = "tx_employee_id", length = 32)
    private String employeeId;

    @Column(name = "ip_phone", length = 20)
    private String ipPhone;

    @Column(name = "tx_email", nullable = false, unique = true, length = 56)
//    @RegexMatch(regexType = "name", message = "invalid value")
    private String email;

    @Column(name = "tx_login_name", nullable = false, updatable = false, unique = true, length = 56)
//    @RegexMatch(regexType = "name", message = "invalid value")
    private String loginName;

    @Column(name = "tx_password")
    private String password;

    @Column(name = "tx_gender", length = 16)
    private String gender;

    @Column(name = "tx_religion", length = 32)
    private String religion;

    @Column(name = "id_designation_key")
    private Long designationId;

    @Column(name = "int_allow_login")
    private Integer allowLogin;

    @Column(name = "int_pass_expired")
    private Integer passExpired;

    @Column(name = "int_two_factor_auth")
    private Integer twoFactorAuth;// two factor authentication

    @Column(name = "tx_verify_code")
    private String verificationCode;

    @Column(name = "tx_new_pass")
    private String newPass; // use when change password

    @Column(name = "tx_tmp_pass")
    private String tmpPass;// use when forgot password

    @Column(name = "tx_address")
    private String address;

    @Column(name = "tx_login_method", length = 24)
    private String logingMethod;

    @Column(name = "tx_division_id")
    private Long divisionId;

    @Column(name = "INT_DEPARTMENT_ID")
    private Long departmentId;

    @Column(name = "INT_SUB_BRANCH_ID")
    private Long subBranchId;

    @Column(name = "TX_PROFILE_IMG_PATH")
    private String profileImagePath;

    @Column(name = "TX_PROFILE_BNNR_PATH")
    private String profileBannerPath;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(
                    name = "user_id", referencedColumnName = "id_user_key"),
            inverseJoinColumns = @JoinColumn(
                    name = "role_id", referencedColumnName = "id_role_key"))
    private Set<Role> roles = new HashSet<>();
//
//    @ManyToMany(mappedBy = "users", fetch = FetchType.LAZY)
//    private Set<Product> products = new HashSet<>();

    @Transient
    private int pageNumber = 10;

    @Transient
    private int pageSize = 20;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getUserVer() {
        return userVer;
    }

    public void setUserVer(Integer userVer) {
        this.userVer = userVer;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getIpPhone() {
        return ipPhone;
    }

    public void setIpPhone(String ipPhone) {
        this.ipPhone = ipPhone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public Long getDesignationId() {
        return designationId;
    }

    public void setDesignationId(Long designationId) {
        this.designationId = designationId;
    }

    public Integer getAllowLogin() {
        return allowLogin;
    }

    public void setAllowLogin(Integer allowLogin) {
        this.allowLogin = allowLogin;
    }

    public Integer getPassExpired() {
        return passExpired;
    }

    public void setPassExpired(Integer passExpired) {
        this.passExpired = passExpired;
    }

    public Integer getTwoFactorAuth() {
        return twoFactorAuth;
    }

    public void setTwoFactorAuth(Integer twoFactorAuth) {
        this.twoFactorAuth = twoFactorAuth;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public String getNewPass() {
        return newPass;
    }

    public void setNewPass(String newPass) {
        this.newPass = newPass;
    }

    public String getTmpPass() {
        return tmpPass;
    }

    public void setTmpPass(String tmpPass) {
        this.tmpPass = tmpPass;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLogingMethod() {
        return logingMethod;
    }

    public void setLogingMethod(String logingMethod) {
        this.logingMethod = logingMethod;
    }

    public Long getDivisionId() {
        return divisionId;
    }

    public void setDivisionId(Long divisionId) {
        this.divisionId = divisionId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getSubBranchId() {
        return subBranchId;
    }

    public void setSubBranchId(Long subBranchId) {
        this.subBranchId = subBranchId;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }



    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public String getProfileImagePath() {
        return profileImagePath;
    }

    public void setProfileImagePath(String profileImagePath) {
        this.profileImagePath = profileImagePath;
    }

    public String getProfileBannerPath() {
        return profileBannerPath;
    }

    public void setProfileBannerPath(String profileBannerPath) {
        this.profileBannerPath = profileBannerPath;
    }

//    public Set<Product> getProducts() {
//        return products;
//    }
//
//    public void setProducts(Set<Product> products) {
//        this.products = products;
//    }

}
