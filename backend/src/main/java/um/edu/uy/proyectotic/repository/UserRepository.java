package um.edu.uy.proyectotic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import um.edu.uy.proyectotic.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
}
