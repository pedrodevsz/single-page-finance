# Integrar consoles frontennd e backend para possíveis erros e melhorias futuras
# Próxima feature -> Integrar menu bar lateral para gráficos e estátisticas
 
## expense-form e income form tem o mesmo useeffect 
useEffect(() => {
    if (!getValues("date")) {
      setValue("date", getLocalDateInputValue(), { shouldDirty: false });
    }
  }, [getValues, setValue]);

## O que esse bloco de código spring faz? 
@PostMapping
 public ResponseEntity<TransactionResponse> create(@Valid @RequestBody CreateTransactionRequest request) {
        TransactionResponse response = transactionService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

