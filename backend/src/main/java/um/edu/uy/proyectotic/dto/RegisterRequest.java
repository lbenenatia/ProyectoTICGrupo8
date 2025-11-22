package um.edu.uy.proyectotic.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class RegisterRequest {
    private String email;
    private String name;
    private String surname;
    private String passwordHash;
    private LocalDate birthDate;
    private Boolean isActive;

    private AddressData address;

    private CardData card;

    @Getter @Setter
    public static class AddressData {
        private String label;
        private String address1;
        private String address2;
        private String number;
        private String city;
        private String state;
        private String zipCode;
        private String phone;
    }

    @Getter @Setter
    public static class CardData {
        private String cardNumber;
        private String cardHolder;
        private String cardExpiry;
        private String cardCVV;
    }
}
