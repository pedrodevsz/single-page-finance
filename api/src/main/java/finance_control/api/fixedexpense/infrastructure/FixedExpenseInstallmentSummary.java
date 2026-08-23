package finance_control.api.fixedexpense.infrastructure;

import java.util.UUID;

public interface FixedExpenseInstallmentSummary {
    UUID getSeriesId();
    String getDescription();
    String getCategory();
    Long getRecordCount();
    Long getPaidCount();
    Long getPendingCount();
}
