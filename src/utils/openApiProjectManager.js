/**
 * OpenAI Project Manager for Node.js/Fastify
 * Programmatically create projects and generate API keys using the Admin API
 */

import axios from "axios";

class OpenAIProjectManager {
  /**
   * Initialize the project manager with an Admin API key.
   *
   * @param {string} adminApiKey - Your OpenAI Admin API key (starts with 'admin-')
   */
  constructor(adminApiKey) {
    this.adminApiKey = adminApiKey;
    this.baseUrl = "https://api.openai.com/v1/organization";
    this.headers = {
      Authorization: `Bearer ${adminApiKey}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Create a new OpenAI project.
   *
   * @param {string} name - Project name
   * @param {string} [description] - Optional project description
   * @returns {Promise<Object>} Project details including project_id
   */
  async createProject(name, description = null) {
    try {
      const url = `${this.baseUrl}/projects`;
      const payload = { name };
      if (description) {
        payload.description = description;
      }

      const response = await axios.post(url, payload, {
        headers: this.headers,
      });
      console.log(`✓ Project created: ${name} (ID: ${response.data.id})`);
      return response.data;
    } catch (error) {
      console.error(
        "Error creating project:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Create a service account for a project.
   * This automatically generates an API key for the service account.
   *
   * @param {string} projectId - The project ID to create the service account in
   * @param {string} name - Name for the service account
   * @returns {Promise<Object>} Service account details including API key
   */
  async createServiceAccount(projectId, name) {
    try {
      const url = `${this.baseUrl}/projects/${projectId}/service_accounts`;
      const payload = { name };

      const response = await axios.post(url, payload, {
        headers: this.headers,
      });
      console.log(`✓ Service account created: ${name}`);
      console.log(`  API Key: ${response.data.api_key?.value || "N/A"}`);

      return response.data;
    } catch (error) {
      console.error(
        "Error creating service account:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * List all projects in the organization.
   *
   * @returns {Promise<Object>} List of projects
   */
  async listProjects() {
    try {
      const url = `${this.baseUrl}/projects`;
      const response = await axios.get(url, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error(
        "Error listing projects:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Get details of a specific project.
   *
   * @param {string} projectId - The project ID
   * @returns {Promise<Object>} Project details
   */
  async getProject(projectId) {
    try {
      const url = `${this.baseUrl}/projects/${projectId}`;
      const response = await axios.get(url, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error(
        "Error getting project:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * List all API keys in a project.
   *
   * @param {string} projectId - The project ID
   * @returns {Promise<Object>} List of API keys
   */
  async listProjectApiKeys(projectId) {
    try {
      const url = `${this.baseUrl}/projects/${projectId}/api_keys`;
      const response = await axios.get(url, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error(
        "Error listing API keys:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Delete an API key from a project.
   *
   * @param {string} projectId - The project ID
   * @param {string} keyId - The API key ID
   * @returns {Promise<boolean>} Success indicator
   */
  async deleteApiKey(projectId, keyId) {
    try {
      const url = `${this.baseUrl}/projects/${projectId}/api_keys/${keyId}`;
      await axios.delete(url, { headers: this.headers });
      console.log(`✓ API key deleted: ${keyId}`);
      return true;
    } catch (error) {
      console.error(
        "Error deleting API key:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Archive a project (soft delete).
   *
   * @param {string} projectId - The project ID
   * @returns {Promise<Object>} Updated project details
   */
  async archiveProject(projectId) {
    try {
      const url = `${this.baseUrl}/projects/${projectId}/archive`;
      const response = await axios.post(url, {}, { headers: this.headers });
      console.log(`✓ Project archived: ${projectId}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error archiving project:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

export default OpenAIProjectManager;
