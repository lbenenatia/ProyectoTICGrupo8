package um.edu.uy.proyectotic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.uy.proyectotic.model.Ticket;

import java.time.LocalDate;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, String> {
  List<Ticket> findAllByEmissionDate(LocalDate date);
}
