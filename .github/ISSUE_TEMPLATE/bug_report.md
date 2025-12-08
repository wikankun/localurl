---
name: 🐛 Bug Report
description: Report a bug or unexpected behavior in LocalURL
title: "[BUG]: "
labels: ["bug", "needs-triage"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report! Please provide as much detail as possible.

  - type: textarea
    id: bug-description
    attributes:
      label: 📋 Bug Description
      description: A clear and concise description of what the bug is.
      placeholder: Describe what happened and why you consider it a bug...
    validations:
      required: true

  - type: textarea
    id: reproduction-steps
    attributes:
      label: 🔄 Steps to Reproduce
      description: Steps to reproduce the behavior. Please provide numbered steps.
      placeholder: |
        1. Open LocalURL in browser
        2. Navigate to '...'
        3. Click on '....'
        4. See error
    validations:
      required: true

  - type: textarea
    id: expected-behavior
    attributes:
      label: ✅ Expected Behavior
      description: What you expected to happen.
      placeholder: I expected the application to...
    validations:
      required: true

  - type: textarea
    id: actual-behavior
    attributes:
      label: ❌ Actual Behavior
      description: What actually happened instead.
      placeholder: The application actually...
    validations:
      required: true

  - type: textarea
    id: screenshots
    attributes:
      label: 📸 Screenshots
      description: If applicable, add screenshots to help explain your problem.
      placeholder: Drag and drop screenshots here or use the attachment button below.

  - type: dropdown
    id: browser
    attributes:
      label: 🌐 Browser
      description: Which browser(s) are you experiencing this issue in?
      multiple: true
      options:
        - Chrome
        - Firefox
        - Safari
        - Edge
        - Opera
        - Brave
        - Other (please specify in description)
    validations:
      required: true

  - type: dropdown
    id: browser-version
    attributes:
      label: 📱 Browser Version
      description: What version of the browser are you using?
      options:
        - "Latest"
        - "Latest - 1"
        - "Latest - 2"
        - "Older (please specify in description)"
    validations:
      required: true

  - type: dropdown
    id: operating-system
    attributes:
      label: 💻 Operating System
      description: Which operating system are you using?
      options:
        - Windows
        - macOS
        - Linux
        - iOS
        - Android
        - Other (please specify in description)
    validations:
      required: true

  - type: dropdown
    id: device-type
    attributes:
      label: 📱 Device Type
      description: What type of device are you using?
      options:
        - Desktop
        - Laptop
        - Tablet
        - Mobile Phone
        - Other (please specify in description)
    validations:
      required: true

  - type: textarea
    id: console-errors
    attributes:
      label: 🖥️ Console Errors
      description: Please copy and paste any error messages from the browser console.
      placeholder: Open Developer Tools (F12) -> Console tab and paste any error messages here.
      render: shell

  - type: textarea
    id: additional-context
    attributes:
      label: 📝 Additional Context
      description: Add any other context about the problem here.
      placeholder: |
        - Is this a recent issue? Did it work before?
        - Are there any specific conditions that trigger this?
        - Have you tried clearing your browser cache/localStorage?
        - Any other information that might be helpful

  - type: checkboxes
    id: terms
    attributes:
      label: ✅ Confirmation
      description: Please confirm the following:
      options:
        - label: I have searched for existing issues that may be related to this bug
          required: true
        - label: I have provided enough information for the team to understand and reproduce the issue
          required: true
        - label: I am not sharing any sensitive or personal information
          required: true