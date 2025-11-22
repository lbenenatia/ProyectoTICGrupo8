package um.edu.uy.proyectotic.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.uy.proyectotic.dto.CardOwnerResponse;
import um.edu.uy.proyectotic.dto.CountResponse;
import um.edu.uy.proyectotic.dto.TicketResponse;
import um.edu.uy.proyectotic.repository.TicketRepository;
import um.edu.uy.proyectotic.repository.UserRepository;
import um.edu.uy.proyectotic.service.CardLookupService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ext")
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:3000"})
public class ExternalIntegrationsController {

  private final CardLookupService cardLookupService;
  private final TicketRepository ticketRepository;
  private final UserRepository userRepository;

  public ExternalIntegrationsController(
      CardLookupService cardLookupService,
      TicketRepository ticketRepository,
      UserRepository userRepository) {
    this.cardLookupService = cardLookupService;
    this.ticketRepository = ticketRepository;
    this.userRepository = userRepository;
  }

  @GetMapping("/payments/card-owner")
  public ResponseEntity<CardOwnerResponse> getCardOwner(@RequestParam String cardNumber) {
    CardOwnerResponse response = cardLookupService.lookup(cardNumber);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/dgi/tickets")
  public ResponseEntity<List<TicketResponse>> getTicketsByDate(
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    return ResponseEntity.ok(
        ticketRepository.findAllByEmissionDate(date).stream().map(TicketResponse::fromEntity).toList()
    );
  }

  @GetMapping("/bps/users/count")
  public ResponseEntity<CountResponse> getUsersCount() {
    long total = userRepository.count();
    return ResponseEntity.ok(new CountResponse(total));
  }
}
