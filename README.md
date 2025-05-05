# Todo API

A simple Node.js API for managing todo items.


## InvisiRisk Integration

To integrate InvisiRisk into your GitHub workflow, add the following steps to each job in your workflow file:

### 1. Add the Setup PSE step at the beginning of each job:

```yaml
- name: Setup PSE
  uses: invisirisk/pse-action@v1.0.20
  with:
    api_url: "https://app.invisirisk.com"
    app_token: ${{ secrets.IR_API_KEY }}
```

### 2. Add the Cleanup PSE step at the end of each job:
```yaml
- name: Cleanup PSE
  if: always()
  uses: invisirisk/pse-action@v1.0.20
  with:
    cleanup: "true"
```