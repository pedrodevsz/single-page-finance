package finance_control.api.financialoption.infrastructure;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import finance_control.api.financialoption.domain.FinancialOption;
import finance_control.api.financialoption.domain.FinancialOptionType;

public interface FinancialOptionRepository extends JpaRepository<FinancialOption, UUID> {
    List<FinancialOption> findAllByTypeOrderByDefaultOptionDescNameAsc(FinancialOptionType type);
    Optional<FinancialOption> findByIdAndType(UUID id, FinancialOptionType type);
    boolean existsByTypeAndNameIgnoreCase(FinancialOptionType type, String name);
    boolean existsByTypeAndNameIgnoreCaseAndIdNot(FinancialOptionType type, String name, UUID id);
}
