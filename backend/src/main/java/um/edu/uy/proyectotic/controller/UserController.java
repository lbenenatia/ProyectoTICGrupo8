package um.edu.uy.proyectotic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import um.edu.uy.proyectotic.model.User;
import um.edu.uy.proyectotic.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

  @Autowired
  private UserRepository repo;

  @GetMapping
  public List<User> getAll() { 
    return repo.findAll(); 
  }

  @PostMapping
  public User create(@RequestBody User u) { 
    return repo.save(u); 
  }

  // ✅ LOGIN
  @PostMapping("/login")
  public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
      String email = loginData.get("email");
      String password = loginData.get("password");

      Optional<User> userOpt = repo.findByEmail(email);
      if (userOpt.isEmpty()) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
      }

      User user = userOpt.get();
      if (!user.getPasswordHash().equals(password)) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
      }

      return ResponseEntity.ok(user);
  }

}
