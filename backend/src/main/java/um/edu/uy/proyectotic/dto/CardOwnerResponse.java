package um.edu.uy.proyectotic.dto;

public record CardOwnerResponse(
    String cardNetwork,
    String holderName,
    String document,
    String billingAddress,
    String maskedPan
) {}
