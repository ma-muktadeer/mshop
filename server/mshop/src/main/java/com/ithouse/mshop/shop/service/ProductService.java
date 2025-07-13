package com.ithouse.mshop.shop.service;

import com.ihouse.core.message.AbstractMessageHeader;
import com.ihouse.core.message.ResponseBuilder;
import com.ihouse.core.message.interfaces.Message;
import com.ihouse.core.message.service.IthouseService;
import com.ithouse.mshop.contants.ActionType;
import com.ithouse.mshop.shop.entity.Product;
import com.ithouse.mshop.shop.projection.ProductProjection;
import com.ithouse.mshop.shop.repo.ProductRepo;
import com.ithouse.mshop.core.utils.DtoMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService extends IthouseService<List<Product>> {

    private static final Logger log = LogManager.getLogger(ProductService.class);

    @Autowired
    private ProductRepo productRepo;

    @Override
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public Message<?> ithouseService(Message requestMessage) throws Exception {
        AbstractMessageHeader header = null;
        Message<?> msgResponse = null;

        try {

            header = requestMessage.getHeader();
            String actionType = header.getActionType();
            if (actionType.equals(ActionType.SELECT_ALL_BY_USER.toString())) {
                List<Product> products = selectAll4User(requestMessage);
                msgResponse = ResponseBuilder.buildResponse(header, products);
            }else if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
                List<Product> products = selectAll(requestMessage);
                msgResponse = ResponseBuilder.buildResponse(header, products);
            }

            else {
                log.info("No ActionType found for actionType: {}",actionType);
            }
        }catch (Exception e) {
            assert header != null;
            msgResponse = ResponseBuilder.buildErrorResponse(header, e);
            msgResponse.getHeader().setExtraInfoMap(null);
            log.error("Exception Message **** [{}]", e.getMessage());
        }
        return msgResponse;
    }

    private List<Product> selectAll(Message<List<Product>> requestMessage) {
        return findAllActiveProduct();
    }

    public List<Product> findAllActiveProduct() {
        List<ProductProjection> products = productRepo.findAllByIsActive(1);
        return buildProjection2DTO(products);
    }
    public List<ProductProjection> findAllActiveProductP() {
        return productRepo.findAllByIsActive(1);
    }

    private List<Product> selectAll4User(Message<List<Product>> requestMessage) {
        long userId = requestMessage.getPayload().getFirst().getUserId();
        return findProductByUserId(userId);
    }
    public List<Product> findProductByUserId(Long userId){
//        List<ProductProjection> productProjections= productRepo.findAllByUsers_UserIdAndIsActive(userId, 1);
        List<ProductProjection> productProjections= productRepo.findAllByIsActive( 1);
        return buildProjection2DTO(productProjections);
    }

    private List<Product> buildProjection2DTO(List<ProductProjection> productProjections){
        if(productProjections == null){
            return null;
        }
        return productProjections.stream().parallel()
                .map(this::buildSingle).toList();
    }
//    private ProductDTO buildSingle(ProductProjection productProjection){
    private Product buildSingle(ProductProjection productProjection){
        if (productProjection == null) {
            return null;
        }
//        return new ProductDTO(productProjection.getProductId(), productProjection.getIsActive(),
//                productProjection.getProductName(), productProjection.getProductDescription(),
//                productProjection.getCreateDate(), productProjection.getProductSellBy(),
//                productProjection.getProductCategories());

        return DtoMapper.map(productProjection, Product.class);
    }

}
