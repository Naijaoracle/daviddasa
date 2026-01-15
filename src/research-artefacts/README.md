# Research Artefacts: Methodology and Frameworks

## Overview

This directory contains conceptual research artefacts that support the PhD research on **Advanced Non-Player Character (NPC) Systems for XR Healthcare Simulation** at Bournemouth University. These documents define evaluation methodologies, assumptions, and frameworks for AI-driven healthcare simulations.

## Purpose and Scope

These artefacts are **safe research documentation** that:
- Define evaluation criteria and methodologies
- Document assumptions and conceptual frameworks
- Provide templates and guidance for scenario design
- Establish governance and ethical boundaries

They are **intentionally non-executable** and contain no:
- Code, schemas, or machine-readable formats
- Parameter values or calibration data
- Implementation details or algorithms
- Executable logic or state machines

## Relationship to PhD Research

This research focuses on developing and evaluating AI-driven NPCs for Extended Reality (XR) healthcare training environments. The artefacts in this directory provide the methodological foundation for:

1. **DASEX Framework Evaluation**: The evaluation methodology artefacts support the D-A-S-E-X (Diagnosis, Adaptation, Safety, Engagement, eXplainability) framework used to assess AI-driven simulations.

2. **Synthetic Data Generation**: Documents define principles and data models for creating safe, synthetic clinical scenarios without using real patient data.

3. **Digital Twin Components**: Assumptions registers document the conceptual basis for physiological and workflow modelling in simulations.

4. **AI Interaction Design**: Frameworks describe how AI agents should interact with human learners in XR environments, focusing on safety and educational effectiveness.

5. **Scenario Management**: Templates and vignettes guide the creation of clinically plausible training scenarios.

## Directory Structure

### Synthetic Data (`synthetic-data/`)
- **data-model-dictionary.md**: Conceptual entities and relationships for synthetic health data
- **principles-disclosure.md**: Core principles for synthetic-only data generation
- **standards-alignment.md**: Conceptual mapping to healthcare standards (e.g., FHIR)

### Digital Twin (`digital-twin/`)
- **physiological-assumptions.md**: Qualitative assumptions for disease progression and interventions
- **workflow-assumptions.md**: Conceptual descriptions of clinical workflows and constraints
- **fidelity-validity-plan.md**: Construct validity targets and validation approaches

### AI Interaction (`ai-interaction/`)
- **interaction-model.md**: Conceptual model of human-AI interactions during evaluation
- **role-team-behaviour-framework.md**: Role definitions and communication patterns

### Evaluation (`evaluation/`)
- **metric-catalogue.md**: Evaluation metrics with intent, evidence requirements, and interpretation
- **reporting-template.md**: Standard structure for reporting evaluation results
- **failure-mode-taxonomy.md**: Categories of failure modes and mitigation approaches

### Visualization (`visualization/`)
- **visualization-requirements.md**: Design requirements for timeline, decision trace, and resource figures
- **interpretation-guidance.md**: How to interpret patterns and avoid false assurance

### Scenario Management (`scenario-management/`)
- **scenario-template-guide.md**: Template for authoring synthetic scenarios
- **vignette-library.md**: Example scenario briefs (fictional, human-readable)
- **review-workflow.md**: Clinical review process and acceptance criteria

### Training (`training/`)
- **training-design-guidance.md**: Learning objectives, facilitation notes, and debrief structure
- **assessment-rubrics.md**: Rubrics aligned to evaluation framework

### Benchmarking (`benchmarking/`)
- **benchmarking-principles.md**: How to design benchmark suites using synthetic scenarios
- **reproducibility-checklist.md**: Requirements for replication and reporting

### Interoperability (`interoperability/`)
- **boundary-statement.md**: Separation requirements and synthetic-only boundaries
- **data-exchange-concepts.md**: Human-readable examples of messages and events

### Governance (`governance/`)
- **governance-charter.md**: Scope, non-clinical use, and contribution rules
- **ethics-risk-pack.md**: Consent templates, participant info sheets, risk assessment language
- **contribution-attribution-policy.md**: Authorship, citation, and review processes

### Deployment (`deployment/`)
- **non-operational-boundary.md**: Clear statement that no deployment artefacts are provided

### Supporting Documentation (`supporting-docs/`)
- **glossary-terminology.md**: Definitions for consistent terminology
- **public-communication-safeguards.md**: Labelling rules and misuse prevention

### Validation (`validation/`)
- **expert-validation-protocol.md**: Panel selection, review process, and agreement measures
- **reliability-bias-plan.md**: Statistical plan for interrater agreement

## Usage

These artefacts are intended for:
- **Research methodology documentation**: Reference in papers, theses, and grant applications
- **Collaboration**: Share with clinical reviewers, supervisors, and research partners
- **Reproducibility**: Enable others to understand and replicate evaluation approaches
- **Governance**: Establish clear boundaries and ethical frameworks

## Key Publications

These artefacts support research published in:
- **Artificial Intelligence in Medicine (2025)**: "Evaluating AI-Driven Characters in Extended Reality (XR) Healthcare Simulations: A Systematic Review" (DOI: 10.1016/j.artmed.2025.103270)

## Contact

For questions about these research artefacts:
- **Researcher**: David Dasa (ddasa@bournemouth.ac.uk)
- **Supervisor**: Professor Wen Tang (wtang@bournemouth.ac.uk)
- **Institution**: Bournemouth University

## License and Attribution

These artefacts are research methodology documents created as part of PhD research at Bournemouth University. They are shared for academic and research purposes. Please cite appropriately when referencing these frameworks.

---

**Note**: These documents describe research methodology and evaluation frameworks. They do not contain implementation details, executable code, or proprietary algorithms. They are designed to be safe for academic sharing while protecting intellectual property in technical implementations.
