# Template de E-mail: Recuperação de Senha (Supabase)

Configure este template no **Supabase Dashboard** em:
`Authentication` → `Email Templates` → `Reset Password`

---

## Assunto (Subject)
```
Redefina sua senha - Fluxo360
```

## Conteúdo (HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    .container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 40px auto; padding: 20px; }
    .card { background: #ffffff; border-radius: 16px; padding: 40px 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); text-align: center; }
    .logo { font-size: 24px; font-weight: bold; margin-bottom: 24px; }
    .logo span:first-child { color: #10b981; }
    .logo span:last-child { color: #3b82f6; }
    h1 { color: #0f172a; font-size: 20px; margin-bottom: 12px; }
    p { color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    .button { display: inline-block; background: linear-gradient(90deg, #10b981, #3b82f6); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px; }
    .footer { margin-top: 32px; color: #94a3b8; font-size: 12px; }
    .link-fallback { margin-top: 16px; font-size: 12px; color: #94a3b8; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo"><span>F</span><span>luxo360</span></div>
      <h1>Redefina sua senha</h1>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha. Se você não solicitou isso, pode ignorar este e-mail.</p>
      <a href="{{ .ConfirmationURL }}" class="button">Redefinir senha</a>
      <div class="footer">
        Este link expira em 24 horas.<br>
        Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
      </div>
      <div class="link-fallback">{{ .ConfirmationURL }}</div>
    </div>
  </div>
</body>
</html>
```

---

## Configuração Importante

No campo **Redirect URL** (URL de redirecionamento) das configurações do provedor de auth, certifique-se de que a seguinte URL está autorizada:

```
https://vchdivjiygyocrlxzsbz.supabase.co/auth/v1/verify
```

E que o `redirectTo` no código está configurado para:

```
https://seudominio.com/auth/callback?next=/atualizar-senha
```

---

## Variáveis Disponíveis

| Variável | Descrição |
|----------|-----------|
| `{{ .ConfirmationURL }}` | URL para redefinição de senha (contém o token) |
| `{{ .Email }}` | E-mail do usuário |
| `{{ .Token }}` | Token de recuperação (uso avançado) |
| `{{ .SiteURL }}` | URL base do site configurada no Supabase |

---

## Testando o Fluxo

1. Acesse `/esqueci-senha`
2. Digite seu e-mail e clique em "Enviar link"
3. Verifique sua caixa de entrada (e spam)
4. Clique no botão "Redefinir senha"
5. Você será redirecionado para `/atualizar-senha`
6. Digite sua nova senha e confirme
7. Será redirecionado para o dashboard
