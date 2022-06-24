# Notes for Box employees

[**Previous:** Contribution guidelines](./index.md) |
[**Next:** The OpenAPI structure and custom attributes](./structure.md)

---

The following content is for Box employees only. If you are not a Box employee
you can skip this section.

## `Jira` & `Confluence`

There are a few internal sources that are of interest to Box employees.

* **`Conluence`:** - Our V2 API specification can be found on our `Confluence`.
  Please check the **API Standards and Patterns** page in the **Engineering and
  Tech Ops** project
* **`Jira`** - When working on the API specification, please open a **`APIWG`**
  and/or a **`DDOC`** `Jira` ticket.
  * **`APIWG`** The API Working Group is there to help you design the changes to
    the API you are working on. They are the group that maintains our API
    standards for V2 APIs. For API design help you can therefore open a
    **`APIWG`** ticket to request their support.
  * **`DDOC`** The developer relations team maintain our developer
      documentation. As our documentation is automatically build off our API
      specification they are often involved in approving these kind of changes.
      For developer documentation support you can therefore open a **`DDOC`**
      ticket to request their support.

## Branches & Pull Requests

When working on the API specification we recommend the following best practices:

* **Branches:** Please only work on a feature branch, as the `main` branch is
  protected. Please use a descriptive name for your branch that mentions both
  the `Jira` ticket this relates to, as well as a human description of the change.
  For example: `ddoc-123/add-ice-cream-api`
* **Pull Requests:** When opening a Pull Request, please use the
  template to provide all the information needed. 
  * Any **DDOC** or **APIWG** `Jira` tickets that this change is related to
  * An estimated date when this change is to go live, if known.
  * A description of the change made
* **Draft Pull Requests:** When working on a design change that has not yet been
  approved, we high recommend creating a **draft Pull Request**, as it won't be
  accidentally merged before the change is ready.

---

[**Next:** The OpenAPI structure and custom attributes](./structure.md)
