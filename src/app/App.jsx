import ReactFlowComponent from '../components/ReactFlowComponent';
import Toolbar from '../components/toolbar/Toolbar';
import { useDiagramState } from './hooks/useDiagramState';

export default function App() {
  const {
  filteredNodes,
  filteredEdges,
  setFilteredNodes,
  setFilteredEdges,
  filter,
  visibleTypes,
  handleFilterApply,
  handleTypeToggle,
  handleRecalculatePositions,
  handleCreateAnnotationNode,
  handleSaveDiagram,
  handleLoadDiagram,
  getEdgeProps,
  handleNodesChange,
  handlePaneClick,
  fileName,
  setFileName,
  isModified,
  setIsModified,
} = useDiagramState();

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Toolbar
        filteredNodes={filteredNodes}
        filteredEdges={filteredEdges}
        setFilteredNodes={setFilteredNodes}
        setFilteredEdges={setFilteredEdges}
        initialFilter={filter}
        initialVisibleTypes={visibleTypes}
        onFilterApply={(filter, visibleTypes) => handleFilterApply(filter, visibleTypes)}
        onTypeChange={handleTypeToggle}
        onRecalculatePositions={handleRecalculatePositions}
        onCreateAnnotationNode={handleCreateAnnotationNode}
        onSaveDiagram={handleSaveDiagram}
        onLoadDiagram={handleLoadDiagram}
        fileName={fileName}
        setFileName={setFileName}
        isModified={isModified}
        setIsModified={setIsModified}
      />  
      <ReactFlowComponent
        nodes={filteredNodes}
        edges={filteredEdges.map((edge) => ({
          ...edge,
          ...getEdgeProps(edge),
        }))}
        onNodesChange={handleNodesChange}
        onPaneClick={handlePaneClick}
      />
    </div>
  );
}
