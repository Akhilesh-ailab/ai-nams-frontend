# A.I.-NAMS Frontend

AI-powered Narcotics Analytics and Management System for Essential Narcotic Drugs (END), built for AIIMS Raipur.

The screens follow the project's Case Record Form (CRF): bulk receipt, issue to department, departmental stock register, patient-wise dispensing, AI alerts, forecasting, NDPS compliance and outcome reports.

> **Status: front-end prototype.** All data is sample data held in the browser. There is no backend yet, and accounts and passwords are stored unhashed in the browser's local storage. Do not enter real credentials, patient data or stock data.

## Tech stack

React, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Redux Toolkit, React Router, React Hook Form, Zod.

## Getting started

```bash
npm install
npm run dev      # development server
npm run build    # type-check and production build
npm run preview  # preview the production build
```

## Roles

| Role | Access |
|---|---|
| Administrator, Hospital Administrator | All modules |
| Pharmacist | Pharmacy, AI Alerts, Forecasting, Analytics |
| Doctor | Clinical |
| Pharmacologist | AI Alerts (can validate), Forecasting, Analytics |
| Regulatory Authority | AI Alerts, Compliance, Reports (read-only compliance) |

## Project structure

```
src/
  components/   layout, common, forms, charts, ui (shadcn)
  constants/    routes, roles, permissions, options and sample data
  lib/          helpers and validations (Zod schemas)
  pages/        auth, dashboard, pharmacy, clinical, ai, compliance, reports
  redux/        store and auth slice
  routes/       app, protected and public routes
  types/        shared TypeScript interfaces
```
