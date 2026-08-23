package finance_control.api.transaction.infrastructure;

public interface MonthlyTransactionTotal {

    String getMonth();

    Long getIncomeInCents();

    Long getExpenseInCents();
}
