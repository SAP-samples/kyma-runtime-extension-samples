package dev.kyma.samples.trigger.model;

public class OrderCreated {
    private String orderCode;

    public String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(String orderCode) {
        this.orderCode = orderCode;
    }

    @Override
    public String toString() {
        return "OrderCreated{" +
                "orderCode='" + orderCode + '\'' +
                '}';
    }
}
