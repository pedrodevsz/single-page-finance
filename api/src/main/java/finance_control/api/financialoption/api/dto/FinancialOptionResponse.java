package finance_control.api.financialoption.api.dto;

import java.util.UUID;

import finance_control.api.financialoption.domain.FinancialOption;
import finance_control.api.financialoption.domain.FinancialOptionType;

public record FinancialOptionResponse(
        UUID id,
        String name,
        FinancialOptionType type,
        boolean defaultOption,
        long usageCount) {
    public static FinancialOptionResponse from(FinancialOption option, long usageCount) {
        return new FinancialOptionResponse(option.getId(), option.getName(), option.getType(), option.isDefaultOption(), usageCount);
    }
}
