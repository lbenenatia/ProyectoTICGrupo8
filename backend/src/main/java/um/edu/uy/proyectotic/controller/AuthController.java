package um.edu.uy.proyectotic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.uy.proyectotic.dto.RegisterRequest;
import um.edu.uy.proyectotic.model.Address;
import um.edu.uy.proyectotic.model.Card;
import um.edu.uy.proyectotic.model.User;
import um.edu.uy.proyectotic.model.enums.Role;
import um.edu.uy.proyectotic.repository.AddressRepository;
import um.edu.uy.proyectotic.repository.CardRepository;
import um.edu.uy.proyectotic.repository.UserRepository;
import um.edu.uy.proyectotic.security.JwtService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Usuario no encontrado"));
        }

        User user = optionalUser.get();

        // Verificar contraseña usando BCrypt
        if (!password.equals(user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("message", "Contraseña incorrecta"));
        }

        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of(
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name()
            )
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.status(400).body(Map.of("message", "El usuario ya existe"));
            }

            User user = User.builder()
                    .email(request.getEmail())
                    .name(request.getName())
                    .surname(request.getSurname())
                    .passwordHash(request.getPasswordHash())
                    .birthDate(request.getBirthDate())
                    .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                    .role(Role.USER)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            userRepository.save(user);

            if (request.getAddress() != null) {
                Address address = Address.builder()
                        .user(user)
                        .label(request.getAddress().getLabel())
                        .address1(request.getAddress().getAddress1())
                        .address2(request.getAddress().getAddress2())
                        .number(request.getAddress().getNumber())
                        .city(request.getAddress().getCity())
                        .state(request.getAddress().getState())
                        .zipCode(request.getAddress().getZipCode())
                        .phone(request.getAddress().getPhone())
                        .build();

                addressRepository.save(address);
            }

            if (request.getCard() != null) {
                Card card = Card.builder()
                        .user(user)
                        .cardNumber(request.getCard().getCardNumber())
                        .cardHolder(request.getCard().getCardHolder())
                        .cardExpiry(request.getCard().getCardExpiry())
                        .cardCVV(request.getCard().getCardCVV())
                        .build();

                cardRepository.save(card);
            }

            return ResponseEntity.ok(Map.of("message", "Usuario registrado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error al registrar usuario: " + e.getMessage()));
        }
    }
}
