package um.edu.uy.proyectotic.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.uy.proyectotic.model.User;
import um.edu.uy.proyectotic.model.enums.Role;
import um.edu.uy.proyectotic.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
public class AdminUsersController {

  private final UserRepository userRepo;

  @GetMapping
  public ResponseEntity<List<User>> listUsers() {
    return ResponseEntity.ok(userRepo.findAll());
  }

  @PutMapping("/{userEmail}/role")
  public ResponseEntity<User> setRole(@PathVariable String userEmail, @RequestParam Role role) {
    User u = userRepo.findByEmail(userEmail).orElseThrow();
    u.setRole(role);
    return ResponseEntity.ok(userRepo.save(u));
  }
}
