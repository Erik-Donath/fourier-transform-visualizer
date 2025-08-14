import PropTypes from 'prop-types';
import './FrequencyComponentsEditor.css';

function FrequencyComponentsEditor({
  components, 
  onUpdateComponent, 
  onAddComponent, 
  onRemoveComponent 
}) {
  return (
    <div className="frequency-components-editor">
      <div className="editor-header">
        <h3 className="editor-title">Frequenzkomponenten</h3>
        <button onClick={onAddComponent} className="add-component-btn">
          + Komponente hinzufügen
        </button>
      </div>
      <div className="frequency-components">
        {components.map((component, index) => (
          <div key={index} className="frequency-component">
            <div className="component-controls">
              <div className="control-group">
                <label>Frequenz (Hz)</label>
                <input
                  type="number"
                  value={component.freq}
                  onChange={(e) => onUpdateComponent(index, 'freq', parseFloat(e.target.value) || 0)}
                  step="0.1"
                  min="0"
                />
              </div>
              <div className="control-group">
                <label>Amplitude</label>
                <input
                  type="number"
                  value={component.amp}
                  onChange={(e) => onUpdateComponent(index, 'amp', parseFloat(e.target.value) || 0)}
                  step="0.1"
                  min="0"
                />
              </div>
              <div className="control-group">
                <label>Phase (rad)</label>
                <input
                  type="number"
                  value={component.phase}
                  onChange={(e) => onUpdateComponent(index, 'phase', parseFloat(e.target.value) || 0)}
                  step="0.1"
                />
              </div>
            </div>
            {components.length > 1 && (
              <button 
                className="remove-component-btn"
                onClick={() => onRemoveComponent(index)}
                title="Remove component"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

FrequencyComponentsEditor.propTypes = {
  components: PropTypes.arrayOf(
    PropTypes.shape({
      freq: PropTypes.number.isRequired,
      amp: PropTypes.number.isRequired,
      phase: PropTypes.number.isRequired,
    })
  ).isRequired,
  onUpdateComponent: PropTypes.func.isRequired,
  onAddComponent: PropTypes.func.isRequired,
  onRemoveComponent: PropTypes.func.isRequired,
};

export default FrequencyComponentsEditor;
