const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STATE_FILE = '.claude/workflow-state.json';

class WorkflowStateManager {
  constructor() {
    this.ensureStateDir();
  }

  ensureStateDir() {
    const dir = path.dirname(STATE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  createWorkflow(userRequest) {
    const workflowId = crypto.randomUUID();
    const state = {
      workflowId,
      userRequest,
      currentStage: 'analyze',
      completedStages: [],
      startTime: new Date().toISOString(),
      stageResults: {},
      checksum: this.calculateChecksum(userRequest)
    };

    this.saveState(state);
    return state;
  }

  updateStage(stage, result, outputPath = null) {
    const state = this.loadState();
    if (!state) {
      throw new Error('No active workflow found');
    }

    state.completedStages.push(stage);
    state.currentStage = this.getNextStage(stage);
    state.stageResults[stage] = outputPath || `${stage}-result.md`;
    state.lastUpdated = new Date().toISOString();

    this.saveState(state);
    return state;
  }

  loadState() {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
    return null;
  }

  saveState(state) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  }

  clearState() {
    if (fs.existsSync(STATE_FILE)) {
      fs.unlinkSync(STATE_FILE);
    }
  }

  getNextStage(currentStage) {
    const stages = ['analyze', 'design', 'implement', 'review', 'deliver'];
    const index = stages.indexOf(currentStage);
    return index < stages.length - 1 ? stages[index + 1] : null;
  }

  calculateChecksum(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  generateSummary() {
    const state = this.loadState();
    if (!state) {
      return null;
    }

    return {
      workflowId: state.workflowId,
      completedStages: state.completedStages.length,
      totalStages: 5,
      progress: (state.completedStages.length / 5) * 100,
      currentStage: state.currentStage,
      startTime: state.startTime,
      duration: state.lastUpdated ?
        new Date(state.lastUpdated) - new Date(state.startTime) :
        Date.now() - new Date(state.startTime)
    };
  }
}

module.exports = WorkflowStateManager;