package um.edu.uy.proyectotic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.uy.proyectotic.model.User;
import um.edu.uy.proyectotic.repository.UserRepository;
import um.edu.uy.proyectotic.security.JwtService;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

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

        if (!user.getPasswordHash().equals(password)) {
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
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("message", "El usuario ya existe"));
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Usuario registrado correctamente"));
    }
}
