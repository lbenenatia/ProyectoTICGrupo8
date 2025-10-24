package um.edu.uy.proyectotic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

import um.edu.uy.proyectotic.model.User;
import um.edu.uy.proyectotic.repository.UserRepository;
import um.edu.uy.proyectotic.security.JwtService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

  @Autowired
  private UserRepository repo;

  @Autowired
  private JwtService jwtService;

  // Register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User u) {
        Optional<User> existing = repo.findByEmail(u.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "El email ya está registrado"));
        }

        User saved = repo.save(u);
        return ResponseEntity.ok(Map.of(
            "message", "Usuario registrado exitosamente",
            "user", saved
        ));
    }

  // Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        Optional<User> userOpt = repo.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Usuario no encontrado"));
        }

        User user = userOpt.get();
        if (!user.getPasswordHash().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Contraseña incorrecta"));
        }

        // ✅ Generar token JWT real
        String token = jwtService.generateToken(email);

        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", user
        ));
    }
}