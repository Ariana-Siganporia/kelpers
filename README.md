# kelpers

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_bKySReStlE6tg4xlQlqUhwwpyNKB)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More


# 🌱 Environmental Crowdsourcing & Community Action Platform

> **See something. Make a difference.**

A crowdsourced environmental intelligence platform that turns everyday observations into community action and useful environmental data.

Users can report environmental conditions around them, discover volunteer opportunities, help confirm community observations, and voluntarily contribute anonymized data for environmental research.

---

## 🌎 The Idea

Environmental problems happen everywhere, but much of what happens around us is never documented.

Someone notices smoke in the distance.

Someone sees a pile of trash in a park.

Someone discovers polluted water.

Someone notices flooding.

Someone sees an injured animal.

Most of these observations disappear after the person walks away.

This platform turns those small observations into useful information.

### The core loop

```text
             ┌─────────────┐
             │   OBSERVE   │
             │             │
             │ See an issue│
             │ Take a photo│
             │ Report it   │
             └──────┬──────┘
                    │
                    ▼
             ┌─────────────┐
             │  UNDERSTAND │
             │             │
             │ Community   │
             │ reports     │
             │      +      │
             │ AI grouping │
             └──────┬──────┘
                    │
                    ▼
             ┌─────────────┐
             │    ACT      │
             │             │
             │ Volunteer   │
             │ Nonprofits  │
             │ Community   │
             └──────┬──────┘
                    │
                    ▼
             ┌─────────────┐
             │   RESEARCH  │
             │             │
             │ Aggregated  │
             │ environmental│
             │ data        │
             └─────────────┘
```

---

## ✨ Features

### 📍 Environmental Reporting

Users can report observations including:

* Litter
* Recycling issues
* Water pollution
* Air pollution
* Smoke and fires
* Chemical pollution
* Wildlife
* Injured wildlife
* Damaged trees
* Invasive species
* Habitat damage
* Flooding
* Storm damage
* Natural disasters
* Drought
* Park conditions
* Beach/coastal issues
* Water leaks
* Light pollution
* Cleanup opportunities

Reports can include:

* Photos
* Location
* Category
* Description
* Severity
* Tags
* Timestamp

---

### 🚨 Crisis Reporting

A dedicated crisis interface allows users to quickly report urgent environmental events.

Examples include:

* Wildfires
* Smoke
* Flooding
* Storm damage
* Natural disasters
* Pollution spills

The crisis flow is intentionally faster than the standard reporting workflow.

---

### 🤖 AI Incident Grouping

Multiple people may report the same event independently.

For example:

```text
Person A → Smoke reported
Person B → Smoke reported
Person C → Fire reported
Person D → Smoke reported
Person E → Smoke reported
       ↓
   AI grouping
       ↓
Likely related incident
       ↓
"Wildfire / Smoke Event"
5 reports
```

The application uses AI-style grouping to demonstrate how individual observations can become larger environmental incidents.

The system intentionally describes these as **likely related** rather than claiming certainty.

---

### 🗺️ Environmental Map

Users can explore environmental observations around them.

The map supports:

* Environmental reports
* Crisis incidents
* Volunteer opportunities
* Category filtering
* Distance filtering
* Date filtering
* Severity filtering

Users can select individual reports or grouped incidents for additional information.

---

### 🧤 Volunteer Opportunities

Users can discover nearby ways to help.

Opportunities can be filtered by:

* Distance
* Cause
* Date
* Duration
* Organization
* Indoor/outdoor
* Skill level

Examples:

* Park cleanup
* Beach cleanup
* Tree planting
* River cleanup
* Wildlife conservation
* Restoration projects

The platform can connect nearby volunteer opportunities with environmental issues reported by the community.

---

### 🏢 Nonprofit Support

Organizations can use the platform to:

* View environmental reports
* Filter reports
* Identify incident clusters
* Respond to incidents
* Create volunteer opportunities

The hackathon demo uses seeded/mock organizations rather than requiring real nonprofit integrations.

---

### 🔬 Environmental Research

Community observations can become a valuable source of aggregated environmental information.

Researchers can request datasets based on:

* Region
* Date range
* Environmental category

Example:

```text
Region:
Atlanta, GA

Date:
January – September 2026

Categories:
Air / Smoke
Water Pollution
Flooding
```

The demo provides simulated research requests and aggregated dataset statistics.

Research data is presented as:

**Voluntary + Aggregated + Anonymized**

---

### 👤 Personal Impact

Users can view their own contributions.

Example:

```text
Your Environmental Impact

17 contributions

9 reports
5 volunteer activities
3 environmental actions
```

The platform focuses on personal/community impact rather than competitive leaderboards.

---

## 🔐 Privacy

Privacy is an important part of the platform.

Public reports use approximate locations rather than exposing exact personal locations.

Research datasets are designed to be aggregated and anonymized.

Users voluntarily contribute their observations.

---

## 🧑‍💻 Technology

The hackathon implementation is designed as a polished frontend-first application.

### Frontend

* Next.js
* TypeScript
* React
* Tailwind CSS
* shadcn/ui
* Lucide icons

### Data

The hackathon demo uses seeded/mock data to simulate:

* Environmental reports
* Incidents
* Organizations
* Volunteer opportunities
* Research requests
* User activity

This allows the product to demonstrate the complete user experience without requiring a large production backend.

---

## 📱 Main Screens

### Home

The central dashboard showing:

* Nearby environmental activity
* Map
* Quick reporting
* Volunteer opportunities
* Community impact

### Map

Interactive exploration of environmental observations and incidents.

### Report

Create a standard environmental observation.

### Crisis

Quickly report urgent environmental events.

### Help

Discover nearby volunteer opportunities.

### Profile

View personal reports, volunteering history, and environmental impact.

### Research

Explore aggregated environmental information and submit data requests.

### Organization View

Demonstrates how nonprofits can interact with community reports.

---

## 🧪 Demo Strategy

The hackathon demo focuses on the full product story rather than production infrastructure.

A typical demonstration:

1. A user notices an environmental issue.
2. They create a report with a photo and location.
3. The report appears on the community map.
4. Several nearby reports are shown as potentially related.
5. AI groups the reports into a likely incident.
6. The user explores the incident.
7. The app recommends a relevant volunteer opportunity.
8. The user joins the opportunity.
9. The user's profile reflects their contribution.
10. Aggregated observations are shown as environmental research data.
11. A researcher can submit a request for an anonymized dataset.

This demonstrates the complete:

**Observe → Understand → Act → Research**

cycle.

---

## 🌱 Future Development

Potential future versions could include:

* Real authentication
* Production database
* Real AI-powered image classification
* Real AI incident clustering
* Real-time notifications
* Verified nonprofit accounts
* Direct nonprofit integrations
* Research data APIs
* Advanced geographic analysis
* Environmental sensors / IoT integrations
* Satellite/environmental datasets
* More sophisticated privacy controls
* Mobile applications for iOS and Android

---

## 🎯 Why It Matters

The goal is to make environmental participation accessible.

People don't always have time to organize a cleanup, attend a meeting, or conduct scientific research.

But they might have 20 seconds to:

**See something → take a photo → report it.**

One observation may seem small.

Thousands of observations can reveal patterns, connect communities with organizations, help researchers understand environmental conditions, and make it easier for people to take action.

---

## 🏆 Hackathon Concept

**See something. Make a difference.**

A simple observation can become community intelligence.

Community intelligence can become action.

And collective action can create better environmental understanding.

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
