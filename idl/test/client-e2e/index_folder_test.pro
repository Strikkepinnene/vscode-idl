;+
; :Description:
;   Test version of notebook initialization (renamed to avoid conflicts)
;
;-
pro vscode_notebookInit_test
  compile_opt idl2, hidden

  ; make sure super magic exists
  defsysv, '!super_magic', exists = _exists
  if ~_exists then defsysv, '!super_magic', orderedhash()

  ; add in a problem (unused var)
  a = 5

  ; make sure super magic exists
  defsysv, '!envi_magic', exists = _exists
  if ~_exists then defsysv, '!envi_magic', list()
end
