---
name: ✨ Feature Request
description: Suggest a new feature or enhancement for LocalURL
title: "[FEATURE]: "
labels: ["enhancement", "feature-request"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for suggesting a new feature for LocalURL! Please provide as much detail as possible to help us understand your request.

  - type: textarea
    id: problem-description
    attributes:
      label: 🎯 Problem Statement
      description: What problem are you trying to solve? What limitation are you facing?
      placeholder: |
        I'm trying to... but I can't because...
        The current limitation is...
        This makes it difficult to...
    validations:
      required: true

  - type: textarea
    id: proposed-solution
    attributes:
      label: 💡 Proposed Solution
      description: How would you like this feature to work? Please be as specific as possible.
      placeholder: |
        I would like to be able to...
        This could be implemented by...
        The user interface should include...
        The behavior should be...
    validations:
      required: true

  - type: textarea
    id: alternatives-considered
    attributes:
      label: 🔄 Alternatives Considered
      description: What other solutions or workarounds have you considered?
      placeholder: |
        I tried using... but it didn't work because...
        Another approach could be...
        I considered... but it has these drawbacks...

  - type: dropdown
    id: feature-type
    attributes:
      label: 📦 Feature Type
      description: What type of feature is this?
      options:
        - User Interface Enhancement
        - New Functionality
        - Performance Improvement
        - Data Management
        - Accessibility Improvement
        - Developer Tool
        - Integration Feature
        - Other (please specify in description)
    validations:
      required: true

  - type: dropdown
    id: priority
    attributes:
      label: 🚨 Priority
      description: How important is this feature to you?
      options:
        - Critical - Blocking my workflow
        - High - Would greatly improve my experience
        - Medium - Nice to have
        - Low - Minor improvement

  - type: textarea
    id: use-cases
    attributes:
      label: 📋 Use Cases
      description: How would you use this feature? What scenarios would benefit from it?
      placeholder: |
        1. When I need to... I could use this to...
        2. For users who want to... this would help...
        3. In situations where... this would be useful...

  - type: textarea
    id: user-interface
    attributes:
      label: 🎨 User Interface Ideas
      description: If applicable, how should this feature appear in the UI?
      placeholder: |
        - Add a button in the toolbar for...
        - Create a new settings option for...
        - Display information in a modal/dialog...
        - Add to the context menu...

  - type: textarea
    id: technical-considerations
    attributes:
      label: 🔧 Technical Considerations
      description: Any technical requirements or constraints to consider?
      placeholder: |
        - This should work offline (must maintain privacy)
        - Needs to be compatible with existing data format
        - Should not require external dependencies
        - Must work across all supported browsers

  - type: textarea
    id: mockups
    attributes:
      label: 📸 Mockups or Examples
      description: If you have any mockups, screenshots, or examples, please share them.
      placeholder: Drag and drop images here or provide links to examples.

  - type: textarea
    id: additional-context
    attributes:
      label: 📝 Additional Context
      description: Add any other context, screenshots, or examples about the feature request.
      placeholder: |
        - Links to similar implementations in other apps
        - References to design patterns
        - Any constraints or requirements
        - Impact on existing users

  - type: checkboxes
    id: willingness-to-contribute
    attributes:
      label: 🤝 Willingness to Contribute
      description: Would you be willing to help implement this feature?
      options:
        - label: I'm interested in implementing this feature myself
        - label: I can help with testing
        - label: I can help with documentation
        - label: I can provide design feedback
        - label: I'm not able to contribute code, but I can help in other ways

  - type: checkboxes
    id: terms
    attributes:
      label: ✅ Confirmation
      description: Please confirm the following:
      options:
        - label: I have searched for existing feature requests
          required: true
        - label: This feature aligns with LocalURL's privacy-first values
          required: true
        - label: I understand this is a volunteer-run project and features are implemented based on community interest
          required: true