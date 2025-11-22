package um.edu.uy.proyectotic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.uy.proyectotic.model.Address;
import um.edu.uy.proyectotic.model.Card;
import um.edu.uy.proyectotic.model.User;
import um.edu.uy.proyectotic.repository.AddressRepository;
import um.edu.uy.proyectotic.repository.CardRepository;
import um.edu.uy.proyectotic.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CardRepository cardRepository;

    @GetMapping("/{email}")
    public ResponseEntity<?> getUserProfile(@PathVariable String email) {
        try {
            Optional<User> optionalUser = userRepository.findByEmail(email);

            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "Usuario no encontrado"));
            }

            User user = optionalUser.get();
            List<Address> addresses = addressRepository.findByUserEmail(email);
            List<Card> cards = cardRepository.findByUserEmail(email);

            Map<String, Object> response = new HashMap<>();

            Map<String, Object> userData = new HashMap<>();
            userData.put("email", user.getEmail());
            userData.put("name", user.getName());
            userData.put("surname", user.getSurname());
            userData.put("birthDate", user.getBirthDate().toString());
            userData.put("isActive", user.getIsActive());
            userData.put("role", user.getRole().name());
            userData.put("createdAt", user.getCreatedAt().toString());

            response.put("user", userData);

            List<Map<String, Object>> addressesData = addresses.stream().map(address -> {
                Map<String, Object> addressMap = new HashMap<>();
                addressMap.put("id", address.getId());
                addressMap.put("label", address.getLabel());
                addressMap.put("address1", address.getAddress1());
                addressMap.put("address2", address.getAddress2());
                addressMap.put("number", address.getNumber());
                addressMap.put("city", address.getCity());
                addressMap.put("state", address.getState());
                addressMap.put("zipCode", address.getZipCode());
                addressMap.put("phone", address.getPhone());
                return addressMap;
            }).collect(Collectors.toList());

            response.put("addresses", addressesData);

            List<Map<String, Object>> cardsData = cards.stream().map(card -> {
                Map<String, Object> cardMap = new HashMap<>();
                cardMap.put("id", card.getId());
                String maskedNumber = "**** **** **** " + card.getCardNumber().replaceAll("\\s", "").substring(card.getCardNumber().replaceAll("\\s", "").length() - 4);
                cardMap.put("cardNumber", maskedNumber);
                cardMap.put("cardHolder", card.getCardHolder());
                cardMap.put("cardExpiry", card.getCardExpiry());
                return cardMap;
            }).collect(Collectors.toList());

            response.put("cards", cardsData);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al obtener datos del usuario: " + e.getMessage()));
        }
    }

    @GetMapping("/{email}/addresses")
    public ResponseEntity<?> getUserAddresses(@PathVariable String email) {
        try {
            List<Address> addresses = addressRepository.findByUserEmail(email);
            return ResponseEntity.ok(addresses);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al obtener direcciones: " + e.getMessage()));
        }
    }

    @GetMapping("/{email}/cards")
    public ResponseEntity<?> getUserCards(@PathVariable String email) {
        try {
            List<Card> cards = cardRepository.findByUserEmail(email);
            List<Map<String, Object>> cardsData = cards.stream().map(card -> {
                Map<String, Object> cardMap = new HashMap<>();
                cardMap.put("id", card.getId());
                String maskedNumber = "**** **** **** " + card.getCardNumber().replaceAll("\\s", "").substring(card.getCardNumber().replaceAll("\\s", "").length() - 4);
                cardMap.put("cardNumber", maskedNumber);
                cardMap.put("cardHolder", card.getCardHolder());
                cardMap.put("cardExpiry", card.getCardExpiry());
                return cardMap;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(cardsData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al obtener tarjetas: " + e.getMessage()));
        }
    }

    // ==================== DIRECCIONES ====================

    @PostMapping("/{email}/addresses")
    public ResponseEntity<?> addAddress(@PathVariable String email, @RequestBody Map<String, String> addressData) {
        try {
            Optional<User> optionalUser = userRepository.findByEmail(email);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "Usuario no encontrado"));
            }

            User user = optionalUser.get();

            Address address = Address.builder()
                    .user(user)
                    .label(addressData.get("label"))
                    .address1(addressData.get("address1"))
                    .address2(addressData.get("address2"))
                    .number(addressData.get("number"))
                    .city(addressData.get("city"))
                    .state(addressData.get("state"))
                    .zipCode(addressData.get("zipCode"))
                    .phone(addressData.get("phone"))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            addressRepository.save(address);

            return ResponseEntity.ok(Map.of("message", "Dirección agregada correctamente", "address", address));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al agregar dirección: " + e.getMessage()));
        }
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<?> updateAddress(@PathVariable Long addressId, @RequestBody Map<String, String> addressData) {
        try {
            Optional<Address> optionalAddress = addressRepository.findById(addressId);
            if (optionalAddress.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "Dirección no encontrada"));
            }

            Address address = optionalAddress.get();
            address.setLabel(addressData.get("label"));
            address.setAddress1(addressData.get("address1"));
            address.setAddress2(addressData.get("address2"));
            address.setNumber(addressData.get("number"));
            address.setCity(addressData.get("city"));
            address.setState(addressData.get("state"));
            address.setZipCode(addressData.get("zipCode"));
            address.setPhone(addressData.get("phone"));
            address.setUpdatedAt(LocalDateTime.now());

            addressRepository.save(address);

            return ResponseEntity.ok(Map.of("message", "Dirección actualizada correctamente", "address", address));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al actualizar dirección: " + e.getMessage()));
        }
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long addressId) {
        try {
            if (!addressRepository.existsById(addressId)) {
                return ResponseEntity.status(404).body(Map.of("message", "Dirección no encontrada"));
            }

            addressRepository.deleteById(addressId);
            return ResponseEntity.ok(Map.of("message", "Dirección eliminada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al eliminar dirección: " + e.getMessage()));
        }
    }

    // ==================== TARJETAS ====================

    @PostMapping("/{email}/cards")
    public ResponseEntity<?> addCard(@PathVariable String email, @RequestBody Map<String, String> cardData) {
        try {
            Optional<User> optionalUser = userRepository.findByEmail(email);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "Usuario no encontrado"));
            }

            User user = optionalUser.get();

            Card card = Card.builder()
                    .user(user)
                    .cardNumber(cardData.get("cardNumber"))
                    .cardHolder(cardData.get("cardHolder"))
                    .cardExpiry(cardData.get("cardExpiry"))
                    .cardCVV(cardData.get("cardCVV"))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            cardRepository.save(card);

            // Retornar tarjeta con número enmascarado
            Map<String, Object> cardResponse = new HashMap<>();
            cardResponse.put("id", card.getId());
            String maskedNumber = "**** **** **** " + card.getCardNumber().replaceAll("\\s", "").substring(card.getCardNumber().replaceAll("\\s", "").length() - 4);
            cardResponse.put("cardNumber", maskedNumber);
            cardResponse.put("cardHolder", card.getCardHolder());
            cardResponse.put("cardExpiry", card.getCardExpiry());

            return ResponseEntity.ok(Map.of("message", "Tarjeta agregada correctamente", "card", cardResponse));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al agregar tarjeta: " + e.getMessage()));
        }
    }

    @PutMapping("/cards/{cardId}")
    public ResponseEntity<?> updateCard(@PathVariable Long cardId, @RequestBody Map<String, String> cardData) {
        try {
            Optional<Card> optionalCard = cardRepository.findById(cardId);
            if (optionalCard.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "Tarjeta no encontrada"));
            }

            Card card = optionalCard.get();
            card.setCardNumber(cardData.get("cardNumber"));
            card.setCardHolder(cardData.get("cardHolder"));
            card.setCardExpiry(cardData.get("cardExpiry"));

            // Solo actualizar CVV si se proporciona
            if (cardData.get("cardCVV") != null && !cardData.get("cardCVV").isEmpty()) {
                card.setCardCVV(cardData.get("cardCVV"));
            }

            card.setUpdatedAt(LocalDateTime.now());

            cardRepository.save(card);

            // Retornar tarjeta con número enmascarado
            Map<String, Object> cardResponse = new HashMap<>();
            cardResponse.put("id", card.getId());
            String maskedNumber = "**** **** **** " + card.getCardNumber().replaceAll("\\s", "").substring(card.getCardNumber().replaceAll("\\s", "").length() - 4);
            cardResponse.put("cardNumber", maskedNumber);
            cardResponse.put("cardHolder", card.getCardHolder());
            cardResponse.put("cardExpiry", card.getCardExpiry());

            return ResponseEntity.ok(Map.of("message", "Tarjeta actualizada correctamente", "card", cardResponse));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al actualizar tarjeta: " + e.getMessage()));
        }
    }

    @DeleteMapping("/cards/{cardId}")
    public ResponseEntity<?> deleteCard(@PathVariable Long cardId) {
        try {
            if (!cardRepository.existsById(cardId)) {
                return ResponseEntity.status(404).body(Map.of("message", "Tarjeta no encontrada"));
            }

            cardRepository.deleteById(cardId);
            return ResponseEntity.ok(Map.of("message", "Tarjeta eliminada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al eliminar tarjeta: " + e.getMessage()));
        }
    }
}
