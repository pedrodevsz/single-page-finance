package finance_control.api.financialoption.domain;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "financial_options")
@EntityListeners(AuditingEntityListener.class)
public class FinancialOption {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 80)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "option_type", nullable = false, length = 30)
    private FinancialOptionType type;

    @Column(name = "is_default", nullable = false)
    private boolean defaultOption;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    protected FinancialOption() {
    }

    public static FinancialOption create(String name, FinancialOptionType type, boolean defaultOption) {
        FinancialOption option = new FinancialOption();
        option.name = normalize(name);
        option.type = Objects.requireNonNull(type, "type");
        option.defaultOption = defaultOption;
        return option;
    }

    public void rename(String name) {
        this.name = normalize(name);
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public FinancialOptionType getType() { return type; }
    public boolean isDefaultOption() { return defaultOption; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public static String normalize(String value) {
        String normalized = Objects.requireNonNull(value, "name").trim().replaceAll("\\s+", " ");
        if (normalized.isEmpty()) throw new IllegalArgumentException("name must not be blank");
        return normalized;
    }
}
