"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Filter, 
  Loader2, 
  AlertTriangle,
  Share2,
  ChevronsUpDown,
  Download,
  Wallet,
  RefreshCw,
  ArrowDownRight,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Move,
  ChevronLeft,
  ChevronRight,
  Hand
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  format, 
  subDays, 
  addMonths, 
  subMonths, 
  getDaysInMonth, 
  startOfMonth, 
  getDay, 
  isToday, 
  isSameDay 
} from 'date-fns';
import { formatUSD } from '@/lib/utils';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

interface TransactionFlowProps {
  walletAddress: string;
}

// Node and edge types for the flow visualization
interface Node {
  id: string;
  transactions: number;
  volume: number;
  label: string;
}

interface Edge {
  source: string;
  target: string;
  amount: number;
  signature: string;
  timestamp: Date | null;
  type: string;
}

// Track viewport state for panning
interface ViewportState {
  translateX: number;
  translateY: number;
  scale: number;
}

export function TransactionFlowVisualization({ walletAddress }: TransactionFlowProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 days ago
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [minAmount, setMinAmount] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isPanning, setIsPanning] = useState<boolean>(true); // Set default to true so dragging works by default
  
  // Track viewport state for panning and zooming
  const [viewport, setViewport] = useState<ViewportState>({
    translateX: 0,
    translateY: 0,
    scale: 1
  });

  // Interactive state for panning
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMousePosition = useRef<{x: number, y: number} | null>(null);
  const svgGroupRef = useRef<SVGGElement | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Fetch transaction flow data
  useEffect(() => {
    async function fetchTransactionFlow() {
      if (!walletAddress) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Format dates for URL
        const startDateStr = startDate.toISOString();
        const endDateStr = endDate.toISOString();
        
        const response = await fetch(
          `/api/wallet/transaction-flow?address=${walletAddress}&limit=10&startDate=${startDateStr}&endDate=${endDateStr}&minAmount=${minAmount}`
        );
        
        if (!response.ok) {
          throw new Error(`Error fetching transaction flow: ${response.statusText}`);
        }
        
        const data = await response.json();
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        
        // Reset viewport when data changes
        setViewport({
          translateX: 0,
          translateY: 0,
          scale: 1
        });
      } catch (error) {
        console.error('Error fetching transaction flow:', error);
        setError(error instanceof Error ? error.message : 'Failed to load transaction flow data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTransactionFlow();
  }, [walletAddress, startDate, endDate, minAmount]);

  // Re-render visualization when data or viewport changes
  useEffect(() => {
    if (isLoading || nodes.length === 0 || edges.length === 0) return;
    
    renderVisualization();
  }, [nodes, edges, zoomLevel, highlightedPath, viewport]);

  // Render the transaction flow visualization using SVG
  const renderVisualization = () => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // Create a group for all elements to enable panning and zooming
    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    // Center the transformation origin and apply scaling + translation
    mainGroup.setAttribute('transform', `translate(${viewport.translateX},${viewport.translateY}) scale(${viewport.scale})`);
    svgGroupRef.current = mainGroup;
    svg.appendChild(mainGroup);
    
    // Set dimensions
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    
    // Position nodes in a circular layout around the central node (wallet address)
    // These coordinates are in the "logical" coordinate system before transformation
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35 * zoomLevel;
    
    // Position nodes
    const nodePositions: Record<string, {x: number, y: number}> = {};
    
    // Central node is the wallet address
    const centralNode = nodes.find(node => node.id === walletAddress);
    nodePositions[walletAddress] = {x: centerX, y: centerY};
    
    // Position other nodes in a circle
    const otherNodes = nodes.filter(node => node.id !== walletAddress);
    otherNodes.forEach((node, index) => {
      const angle = (index / otherNodes.length) * 2 * Math.PI;
      nodePositions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    
    // Draw edges
    edges.forEach(edge => {
      const sourcePos = nodePositions[edge.source];
      const targetPos = nodePositions[edge.target];
      
      if (!sourcePos || !targetPos) return;
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(sourcePos.x));
      line.setAttribute('y1', String(sourcePos.y));
      line.setAttribute('x2', String(targetPos.x));
      line.setAttribute('y2', String(targetPos.y));
      
      // Determine if this edge is part of a highlighted path
      const isHighlighted = highlightedPath.includes(edge.source) && highlightedPath.includes(edge.target);
      
      // Apply stroke width accounting for zoom level to maintain visual proportion
      const baseStrokeWidth = isHighlighted ? 3 : 1.5;
      // Line width stays consistent regardless of zoom
      line.setAttribute('stroke', isHighlighted ? '#22c55e' : '#475569');
      line.setAttribute('stroke-width', String(baseStrokeWidth / viewport.scale));
      line.setAttribute('stroke-opacity', isHighlighted ? '1' : '0.6');
      
      // Arrow for direction
      const arrowSize = 10 / viewport.scale; // Scale arrow with zoom level
      const dx = targetPos.x - sourcePos.x;
      const dy = targetPos.y - sourcePos.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const nx = dx / length;
      const ny = dy / length;
      
      // Position arrow slightly away from the target
      const arrowX = targetPos.x - nx * (20 / viewport.scale); // 20px away from target, scaled
      const arrowY = targetPos.y - ny * (20 / viewport.scale);
      
      // Create arrow marker
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      marker.setAttribute('points', `${arrowX},${arrowY} ${arrowX - arrowSize * (nx + ny/2)},${arrowY - arrowSize * (ny - nx/2)} ${arrowX - arrowSize * (nx - ny/2)},${arrowY - arrowSize * (ny + nx/2)}`);
      marker.setAttribute('fill', isHighlighted ? '#22c55e' : '#475569');
      
      // Add edge label (amount)
      // Only show transaction amount if it's >= 0.001 SOL
      if (edge.amount >= 0.001) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String((sourcePos.x + targetPos.x) / 2 + ny * 20));
        text.setAttribute('y', String((sourcePos.y + targetPos.y) / 2 - nx * 20));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#f1f5f9');
        // Adjust font size based on zoom level to maintain readability
        text.setAttribute('font-size', String(12 / viewport.scale));
        
        // Format the amount with proper precision
        const formattedAmount = edge.amount < 0.01 
          ? edge.amount.toFixed(3)
          : edge.amount.toFixed(2);
        text.textContent = `${formattedAmount} SOL`;
        
        // Create background for better readability
        const textBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        textBg.setAttribute('fill', 'rgba(15, 23, 42, 0.7)'); // Semi-transparent background
        textBg.setAttribute('rx', String(3 / viewport.scale));
        
        // Calculate text dimensions to fit background
        const textWidth = (text.textContent.length * 7) / viewport.scale;
        const textHeight = 14 / viewport.scale;
        
        textBg.setAttribute('x', String(parseFloat(text.getAttribute('x') || '0') - textWidth/2));
        textBg.setAttribute('y', String(parseFloat(text.getAttribute('y') || '0') - textHeight));
        textBg.setAttribute('width', String(textWidth));
        textBg.setAttribute('height', String(textHeight));
        
        mainGroup.appendChild(textBg);
        mainGroup.appendChild(text);
      }
      
      // Create edge hover effect for better visibility
      const edgeHitArea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      edgeHitArea.setAttribute('x1', String(sourcePos.x));
      edgeHitArea.setAttribute('y1', String(sourcePos.y));
      edgeHitArea.setAttribute('x2', String(targetPos.x));
      edgeHitArea.setAttribute('y2', String(targetPos.y));
      edgeHitArea.setAttribute('stroke', 'transparent');
      edgeHitArea.setAttribute('stroke-width', String(10 / viewport.scale)); // Wider hit area for easier selection
      
      // Attach event listener for highlighting path
      const edgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      edgeGroup.appendChild(line);
      edgeGroup.appendChild(marker);
      edgeGroup.appendChild(edgeHitArea);
      
      // Hover effects to make edges more interactive
      edgeHitArea.addEventListener('mouseover', () => {
        line.setAttribute('stroke-width', String(3 / viewport.scale));
        line.setAttribute('stroke-opacity', '1');
      });
      
      edgeHitArea.addEventListener('mouseout', () => {
        line.setAttribute('stroke-width', String(baseStrokeWidth / viewport.scale));
        line.setAttribute('stroke-opacity', isHighlighted ? '1' : '0.6');
      });
      
      edgeGroup.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent propagation to avoid triggering other events
        setHighlightedPath([edge.source, edge.target]);
      });
      
      mainGroup.appendChild(edgeGroup);
    });
    
    // Draw nodes
    nodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', String(pos.x));
      circle.setAttribute('cy', String(pos.y));
      
      // Base node size adjusted by transaction volume
      const baseNodeSize = 8 + Math.min(12, node.volume);
      // Size stays consistent regardless of zoom
      circle.setAttribute('r', String(baseNodeSize / viewport.scale));
      
      // Determine if this node is highlighted
      const isHighlighted = highlightedPath.includes(node.id);
      const isMainWallet = node.id === walletAddress;
      
      // Styling based on node type and highlight state
      if (isMainWallet) {
        circle.setAttribute('fill', '#22c55e');
        circle.setAttribute('stroke', '#14532d');
      } else {
        circle.setAttribute('fill', isHighlighted ? '#0ea5e9' : '#1e293b');
        circle.setAttribute('stroke', isHighlighted ? '#075985' : '#334155');
      }
      circle.setAttribute('stroke-width', String((isHighlighted ? 3 : 2) / viewport.scale));
      
      // Create node label background for better readability at any zoom level
      const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const labelPadding = 4 / viewport.scale;
      
      // Node label - text is inverse scaled so it remains readable
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(pos.x));
      text.setAttribute('y', String(pos.y + (baseNodeSize + 14) / viewport.scale));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#f1f5f9');
      text.setAttribute('font-size', String(12 / viewport.scale));
      
      // Show more detailed address at higher zoom levels
      if (viewport.scale >= 1.5) {
        // Show more of the address when zoomed in
        text.textContent = node.id.length > 12 ? 
          `${node.id.substring(0, 6)}...${node.id.substring(node.id.length - 6)}` : 
          node.label;
      } else {
        text.textContent = node.label;
      }
      
      // Set background dimensions after text is created
      const textBox = text.getBBox ? text.getBBox() : { x: 0, y: 0, width: 0, height: 0 };
      labelBg.setAttribute('x', String(textBox.x - labelPadding));
      labelBg.setAttribute('y', String(textBox.y - labelPadding));
      labelBg.setAttribute('width', String(textBox.width + labelPadding * 2));
      labelBg.setAttribute('height', String(textBox.height + labelPadding * 2));
      labelBg.setAttribute('rx', String(3 / viewport.scale));
      labelBg.setAttribute('fill', 'rgba(15, 23, 42, 0.7)'); // Semi-transparent background
      
      // Add tooltips for detailed info on hover
      const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      tooltip.setAttribute('opacity', '0');
      tooltip.setAttribute('pointer-events', 'none'); // Make sure tooltips don't interfere with interactions
      
      const tooltipBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      tooltipBg.setAttribute('fill', '#0f172a');
      tooltipBg.setAttribute('stroke', '#475569');
      tooltipBg.setAttribute('stroke-width', String(1 / viewport.scale));
      tooltipBg.setAttribute('rx', String(4 / viewport.scale));
      
      const tooltipTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tooltipTitle.setAttribute('fill', '#f1f5f9');
      tooltipTitle.setAttribute('font-size', String(10 / viewport.scale));
      tooltipTitle.setAttribute('font-weight', 'bold');
      tooltipTitle.setAttribute('text-anchor', 'middle'); // Center the text
      
      const tooltipAddress = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tooltipAddress.setAttribute('fill', '#94a3b8');
      tooltipAddress.setAttribute('font-size', String(9 / viewport.scale));
      tooltipAddress.setAttribute('text-anchor', 'middle'); // Center the text
      
      // Break long addresses into multiple parts to prevent truncation
      const formattedAddress = formatAddressForDisplay(node.id);
      tooltipAddress.textContent = formattedAddress;
      
      const tooltipTxs = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tooltipTxs.setAttribute('fill', '#94a3b8');
      tooltipTxs.setAttribute('font-size', String(9 / viewport.scale));
      tooltipTxs.setAttribute('text-anchor', 'middle'); // Center the text
      tooltipTxs.textContent = `Transactions: ${node.transactions}`;
      
      // Add a "Click to copy" instruction
      const tooltipCopy = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tooltipCopy.setAttribute('fill', '#38bdf8');
      tooltipCopy.setAttribute('font-size', String(8 / viewport.scale));
      tooltipCopy.setAttribute('text-anchor', 'middle');
      tooltipCopy.setAttribute('font-style', 'italic');
      tooltipCopy.textContent = `Click to copy address`;
      
      tooltip.appendChild(tooltipBg);
      tooltip.appendChild(tooltipTitle);
      tooltip.appendChild(tooltipAddress);
      tooltip.appendChild(tooltipTxs);
      tooltip.appendChild(tooltipCopy);
      
      // Hover effects
      circle.addEventListener('mouseover', () => {
        circle.setAttribute('stroke-width', String(4 / viewport.scale));
        circle.setAttribute('r', String((baseNodeSize + 2) / viewport.scale));
        tooltip.setAttribute('opacity', '1');
        
        // Position and size the tooltip
        tooltipTitle.setAttribute('x', String(pos.x));
        tooltipTitle.setAttribute('y', String(pos.y - (baseNodeSize + 20) / viewport.scale));
        tooltipTitle.textContent = isMainWallet ? 'Main Wallet' : 'Connected Wallet';
        
        tooltipAddress.setAttribute('x', String(pos.x));
        tooltipAddress.setAttribute('y', String(pos.y - (baseNodeSize + 8) / viewport.scale));
        
        tooltipTxs.setAttribute('x', String(pos.x));
        tooltipTxs.setAttribute('y', String(pos.y - (baseNodeSize - 4) / viewport.scale));
        
        // Size the tooltip background after text is positioned
        const titleBox = tooltipTitle.getBBox ? tooltipTitle.getBBox() : { x: 0, y: 0, width: 0, height: 0 };
        const addressBox = tooltipAddress.getBBox ? tooltipAddress.getBBox() : { x: 0, y: 0, width: 0, height: 0 };
        const txsBox = tooltipTxs.getBBox ? tooltipTxs.getBBox() : { x: 0, y: 0, width: 0, height: 0 };
        
        const tooltipWidth = Math.max(titleBox.width, addressBox.width, txsBox.width) + 20 / viewport.scale;
        const tooltipHeight = (titleBox.height + addressBox.height + txsBox.height) + 16 / viewport.scale;
        
        tooltipBg.setAttribute('x', String(pos.x - tooltipWidth / 2));
        tooltipBg.setAttribute('y', String(pos.y - (baseNodeSize + 46) / viewport.scale));
        tooltipBg.setAttribute('width', String(tooltipWidth));
        tooltipBg.setAttribute('height', String(tooltipHeight));
      });
      
      circle.addEventListener('mouseout', () => {
        circle.setAttribute('stroke-width', String((isHighlighted ? 3 : 2) / viewport.scale));
        circle.setAttribute('r', String(baseNodeSize / viewport.scale));
        tooltip.setAttribute('opacity', '0');
      });
      
      // Highlight node on click
      group.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent propagation to avoid triggering other events
        setHighlightedPath([node.id]);
      });
      
      // Make the node interactive
      group.style.cursor = 'pointer';
      
      // Add click event to copy the address
      group.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent propagation to avoid triggering other click events
        copyToClipboard(node.id);
      });
      
      // Add elements in proper order for layering
      group.appendChild(labelBg);
      group.appendChild(text);
      group.appendChild(circle);
      group.appendChild(tooltip);
      mainGroup.appendChild(group);
    });
  };

  // Add click handler for the SVG background separately, not within renderVisualization
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    
    const handleBackgroundClick = (e: MouseEvent) => {
      // Check if the click is directly on the SVG or main group
      if (e.target === svg || e.target === svgGroupRef.current) {
        setHighlightedPath([]);
      }
    };
    
    svg.addEventListener('click', handleBackgroundClick);
    
    // Clean up to prevent memory leaks and duplicate listeners
    return () => {
      svg.removeEventListener('click', handleBackgroundClick);
    };
  }, []);

  // Mouse handlers for panning
  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    // Always enable dragging, regardless of isPanning mode
    setIsDragging(true);
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
    
    // Add cursor styling
    if (svgRef.current) {
      svgRef.current.style.cursor = 'grabbing';
    }
  }, []);
  
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !lastMousePosition.current) return;
    
    const dx = e.clientX - lastMousePosition.current.x;
    const dy = e.clientY - lastMousePosition.current.y;
    
    setViewport(prev => ({
      ...prev,
      translateX: prev.translateX + dx,
      translateY: prev.translateY + dy
    }));
    
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  }, [isDragging]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    lastMousePosition.current = null;
    
    // Reset cursor
    if (svgRef.current) {
      svgRef.current.style.cursor = 'grab';
    }
  }, []);

  // Wheel event for zooming
  const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    
    // Determine zoom direction
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const newScale = Math.max(0.5, Math.min(3, viewport.scale + delta));
    
    // Calculate zoom point (relative to SVG)
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Calculate coordinates relative to SVG center (for centered zooming)
    const svgCenterX = rect.width / 2;
    const svgCenterY = rect.height / 2;
    
    // When zooming, keep the diagram centered
    setViewport(prev => ({
      scale: newScale,
      translateX: svgCenterX - (svgCenterX - prev.translateX) * (newScale / prev.scale),
      translateY: svgCenterY - (svgCenterY - prev.translateY) * (newScale / prev.scale)
    }));
  }, [viewport]);

  // Toggle panning mode
  const togglePanMode = () => {
    setIsPanning(!isPanning);
  };

  // Copy wallet address to clipboard
  const copyToClipboard = (text: string, label: string = 'Address') => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  // Reset view
  const resetView = () => {
    setViewport({
      translateX: 0,
      translateY: 0,
      scale: 1
    });
    setZoomLevel(1);
    setHighlightedPath([]);
  };

  // Zoom controls that manipulate viewport scale
  const zoomIn = () => {
    setViewport(prev => ({
      ...prev,
      scale: Math.min(prev.scale + 0.2, 3)
    }));
  };

  const zoomOut = () => {
    setViewport(prev => ({
      ...prev,
      scale: Math.max(prev.scale - 0.2, 0.5)
    }));
  };

  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!canvasRef.current) return;
    
    if (!isFullScreen) {
      if (canvasRef.current.requestFullscreen) {
        canvasRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullScreen(!isFullScreen);
  };

  // Apply filters
  const applyFilters = () => {
    setIsFiltersOpen(false);
    // Data will reload automatically due to the useEffect dependency
  };

  // Reset filters
  const resetFilters = () => {
    setStartDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    setEndDate(new Date());
    setMinAmount(0);
    setIsFiltersOpen(false);
  };

  // Detect fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Reset pan and zoom on data change
  useEffect(() => {
    resetView();
  }, [walletAddress]);

  // Helper function to format addresses for display
  const formatAddressForDisplay = (address: string): string => {
    if (!address || address.length <= 12) return address;
    
    // For cleaner display in tooltip, show first 8 and last 8 chars
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="bg-slate-700/50 w-8 h-8 rounded-full flex items-center justify-center mr-3">
            <Share2 className="h-4 w-4 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold">Transaction Flow Visualization</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="ml-auto text-slate-300 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          {isFiltersOpen && (
            <div className="absolute right-0 top-12 w-full md:w-80 z-10 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-lg">
              <div className="p-4 text-slate-300">
                <h3 className="font-medium mb-3 text-slate-200">Transaction Filters</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Date Range</label>
                    
                    <div className="mb-3">
                      <p className="text-sm text-slate-400 mb-1">Start Date</p>
                      <CustomDatePicker 
                        date={startDate} 
                        onDateChange={(date) => setStartDate(date)}
                        className="w-full bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-slate-400 mb-1">End Date</p>
                      <CustomDatePicker 
                        date={endDate} 
                        onDateChange={(date) => setEndDate(date)}
                        className="w-full bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Min Amount (SOL)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.001"
                      value={minAmount}
                      onChange={(e) => setMinAmount(parseFloat(e.target.value) || 0)}
                      className="bg-slate-800 border-slate-700 text-slate-300 focus:border-sky-500"
                    />
                  </div>

                  <div className="flex justify-between gap-2 pt-2">
                    <Button 
                      variant="outline"
                      className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                    <Button 
                      className="bg-sky-600 hover:bg-sky-500 text-white flex-grow"
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={toggleFullScreen}
            className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Data summary pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="px-3 py-1 bg-slate-700 rounded-full text-xs flex items-center">
          <Calendar className="h-3 w-3 mr-1 text-emerald-400" />
          <span>{format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}</span>
        </div>
        
        <div className="px-3 py-1 bg-slate-700 rounded-full text-xs flex items-center">
          <Wallet className="h-3 w-3 mr-1 text-emerald-400" />
          <span>{nodes.length} Wallets</span>
        </div>
        
        <div className="px-3 py-1 bg-slate-700 rounded-full text-xs flex items-center">
          <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-400" />
          <span>{edges.length} Transactions</span>
        </div>
        
        {minAmount > 0 && (
          <div className="px-3 py-1 bg-slate-700 rounded-full text-xs flex items-center">
            <ChevronsUpDown className="h-3 w-3 mr-1 text-emerald-400" />
            <span>Min {minAmount} SOL</span>
          </div>
        )}
      </div>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-slate-400">Loading transaction flow data...</p>
        </div>
      )}
      
      {!isLoading && error && (
        <div className="bg-slate-700 rounded-lg p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-amber-500">Error Loading Data</h3>
          <p className="text-slate-400">{error}</p>
        </div>
      )}
      
      {!isLoading && !error && (nodes.length === 0 || edges.length === 0) && (
        <div className="bg-slate-700 rounded-lg p-6 text-center">
          <Share2 className="h-8 w-8 text-slate-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">No Transaction Flow Data</h3>
          <p className="text-slate-400">
            No transaction flow data found for this wallet within the selected time period.
            Try changing the date range or filters.
          </p>
        </div>
      )}
      
      {!isLoading && !error && nodes.length > 0 && edges.length > 0 && (
        <div className="mt-2">
          {/* Control buttons */}
          <div className="flex justify-center mb-4 space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={zoomOut}
              className="bg-slate-700 border-slate-600 text-white"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetView}
              className="bg-slate-700 border-slate-600 text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={zoomIn}
              className="bg-slate-700 border-slate-600 text-white"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant={isPanning ? "default" : "outline"}
              size="sm" 
              onClick={togglePanMode}
              className={isPanning 
                ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                : "bg-slate-700 border-slate-600 text-white"
              }
            >
              {isPanning ? <Hand className="h-4 w-4" /> : <Move className="h-4 w-4" />}
            </Button>
            {highlightedPath.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setHighlightedPath([])}
                className="bg-slate-700 border-slate-600 text-white ml-4"
              >
                Clear Highlight
              </Button>
            )}
          </div>
          
          {/* Visualization canvas */}
          <div 
            ref={canvasRef} 
            className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700"
            style={{ height: '500px' }}
          >
            <svg 
              ref={svgRef} 
              width="100%" 
              height="100%" 
              className="w-full h-full cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            />
          </div>
          
          {/* Legend */}
          <div className="flex justify-center mt-4 text-xs text-slate-400">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1"></div>
              <span>Main Wallet</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 rounded-full bg-slate-700 mr-1"></div>
              <span>Connected Wallets</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span>Highlighted Wallet</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-1 bg-emerald-500 mr-1"></div>
              <span>Highlighted Path</span>
            </div>
          </div>
          
          {/* Help tips */}
          <div className="mt-4 text-center text-xs text-slate-500">
            <p>
              <span className="bg-slate-800 px-2 py-1 rounded">Mouse wheel</span> to zoom in/out, 
              <span className="bg-slate-800 px-2 py-1 rounded ml-2">Click & drag</span> to move the diagram around
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Date Picker Component for better UX and control
function CustomDatePicker({ date, onDateChange, className }: { date: Date, onDateChange: (date: Date) => void, className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(date));
  const datePickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Close calendar when clicking outside
  useEffect(() => {
    // Handle clicks outside the date picker
    function handleClickOutside(event: MouseEvent) {
      // Skip if calendar is already closed
      if (!isOpen) return;
      
      const target = event.target as unknown as HTMLElement;
      
      // Check if click is outside both the calendar and the trigger button
      if (
        datePickerRef.current && 
        !datePickerRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    
    // Register document-wide click listener
    document.addEventListener('mousedown', handleClickOutside, true);
    
    // Handle escape key to close calendar
    function handleEscapeKey(event: KeyboardEvent) {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    
    // Register escape key listener
    document.addEventListener('keydown', handleEscapeKey, true);
    
    // Clean up all listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscapeKey, true);
    };
  }, [isOpen]);
  
  // Update currentMonth when date changes from outside
  useEffect(() => {
    setCurrentMonth(new Date(date));
  }, [date]);
  
  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDayOfMonth = startOfMonth(currentMonth);
    const startingDayIndex = getDay(firstDayOfMonth); // 0 for Sunday, 1 for Monday, etc.
    const daysInMonth = getDaysInMonth(currentMonth);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      
      const isSelectedDay = isSameDay(currentDate, date);
      const isTodayDate = isToday(currentDate);
      
      days.push(
        <button
          key={`day-${day}`}
          onClick={() => {
            onDateChange(currentDate);
            setIsOpen(false);
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-md text-sm transition-colors
            ${isSelectedDay ? 'bg-sky-600 text-white hover:bg-sky-500' : 
              isTodayDate ? 'bg-slate-800 text-sky-400 hover:bg-slate-700' : 
              'text-slate-300 hover:bg-slate-800'}`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="outline"
        className={`${className} w-full justify-start text-left font-normal`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="mr-2 h-4 w-4 text-sky-400" />
        {format(date, 'MMM dd, yyyy')}
      </Button>
      
      {isOpen && (
        <div 
          ref={datePickerRef} 
          className="absolute z-50 mt-1 w-full bg-slate-900 rounded-md border border-slate-700 shadow-lg p-3"
        >
          <div className="mb-3 flex items-center justify-between">
            <button 
              onClick={goToPreviousMonth}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800"
            >
              <ChevronLeft size={16} />
            </button>
            <h3 className="text-slate-200 font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button 
              onClick={goToNextMonth}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-slate-400 text-xs mb-1">
            <div className="text-center">Su</div>
            <div className="text-center">Mo</div>
            <div className="text-center">Tu</div>
            <div className="text-center">We</div>
            <div className="text-center">Th</div>
            <div className="text-center">Fr</div>
            <div className="text-center">Sa</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays()}
          </div>
        </div>
      )}
    </div>
  );
}
