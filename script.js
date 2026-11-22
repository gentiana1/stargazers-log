const eventsList = document.querySelector("#events-list");

function isValidRepository(repository) {
  if (!repository || typeof repository !== "object") {
    return false;
  }

  if (
    typeof repository.name !== "string" ||
    typeof repository.description !== "string" ||
    typeof repository.language !== "string" ||
    typeof repository.starred_at !== "string" ||
    typeof repository.url !== "string" ||
    typeof repository.stars !== "number" ||
    !Number.isFinite(repository.stars)
  ) {
    return false;
  }

  try {
    const url = new URL(repository.url);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

async function renderRepositories() {
  if (!eventsList) {
    return;
  }

  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Unable to load repositories (${response.status})`);
    }

    const repositories = await response.json();
    eventsList.replaceChildren();

    if (!Array.isArray(repositories)) {
      throw new Error("Repository data is not in the expected format.");
    }

    if (repositories.length === 0) {
      const emptyState = document.createElement("li");
      emptyState.className = "repository-empty";
      emptyState.textContent = "No starred repositories found.";
      eventsList.append(emptyState);
      return;
    }

    if (!repositories.every(isValidRepository)) {
      throw new Error("Some repository data could not be read.");
    }

    repositories.forEach((repository) => {
      const item = document.createElement("li");
      item.className = "repository";

      const name = document.createElement("a");
      name.className = "repository-name";
      name.href = repository.url;
      name.textContent = repository.name;
      name.target = "_blank";
      name.rel = "noopener noreferrer";

      const newTabLabel = document.createElement("span");
      newTabLabel.className = "visually-hidden";
      newTabLabel.textContent = " (opens in a new tab)";
      name.append(newTabLabel);

      const description = document.createElement("p");
      description.className = "repository-description";
      description.textContent = repository.description;

      const meta = document.createElement("p");
      meta.className = "repository-meta";
      meta.textContent = [
        `Language: ${repository.language}`,
        `Stars: ${repository.stars.toLocaleString()}`,
        `Starred: ${repository.starred_at}`,
      ].join(" | ");

      item.append(name, description, meta);
      eventsList.append(item);
    });
  } catch (error) {
    const message = document.createElement("li");
    message.className = "error";
    message.setAttribute("role", "alert");
    message.textContent =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while loading repositories.";
    eventsList.replaceChildren(message);
  }
}

renderRepositories();
