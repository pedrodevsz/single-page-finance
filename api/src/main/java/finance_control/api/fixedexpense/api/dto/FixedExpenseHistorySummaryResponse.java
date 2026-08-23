package finance_control.api.fixedexpense.api.dto;

import java.util.UUID;

public record FixedExpenseHistorySummaryResponse(
        UUID seriesId,
        String description,
        String category,
        Long recordCount,
        Long paidCount,
        Long pendingCount) {
}
