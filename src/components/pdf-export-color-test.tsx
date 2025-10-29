"use client";

import React from 'react';
import { ColorConverter } from '@/lib/color-converter';
import { Button } from '@/components/ui/button';

/**
 * Test component for PDF export color conversion
 * This component helps test and debug color conversion functionality
 */
const PDFExportColorTest: React.FC = () => {
  const testColors = [
    'oklch(0.208 0.042 265.755)',
    'oklch(0.984 0.003 247.858)',
    'lab(50 20 -30)',
    'lch(70 50 180)',
    'hsl(220, 50%, 40%)',
    '#3498db',
    'rgb(255, 0, 0)',
  ];

  const handleTestConversion = () => {
    console.log('=== Color Conversion Test ===');
    
    testColors.forEach(color => {
      const converted = ColorConverter.parseAndConvertToRgb(color);
      console.log(`${color} → ${converted}`);
    });

    // Test CSS conversion
    const testCSS = `
      .test {
        color: oklch(0.208 0.042 265.755);
        background: lab(50 20 -30);
        border-color: lch(70 50 180);
      }
    `;
    
    console.log('Original CSS:', testCSS);
    console.log('Converted CSS:', ColorConverter.convertStyleSheetColors(testCSS));
  };

  const handleTestElement = async () => {
    // Create a test element with modern colors
    const testElement = document.createElement('div');
    testElement.style.color = 'oklch(0.208 0.042 265.755)';
    testElement.style.backgroundColor = 'lab(50 20 -30)';
    testElement.style.borderColor = 'lch(70 50 180)';
    testElement.innerHTML = '<p style="color: oklch(0.5 0.1 180);">Test Text</p>';
    
    console.log('Before conversion:');
    console.log('Main element color:', testElement.style.color);
    console.log('Main element background:', testElement.style.backgroundColor);
    console.log('Child element color:', (testElement.firstChild as HTMLElement)?.style.color);
    
    // Apply conversion (simulate the method used in PDF export)
    const convertInlineStyles = (element: HTMLElement) => {
      const style = element.style;
      const stylesToConvert = [
        'color', 'backgroundColor', 'background', 'borderColor', 
        'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
        'outline', 'outlineColor', 'textDecorationColor', 'boxShadow', 'textShadow'
      ];

      stylesToConvert.forEach(property => {
        const value = style.getPropertyValue(property);
        if (value) {
          const convertedValue = ColorConverter.parseAndConvertToRgb(value);
          if (convertedValue !== value) {
            style.setProperty(property, convertedValue);
          }
        }
      });
    };
    
    convertInlineStyles(testElement);
    
    // Convert all child elements
    const allElements = testElement.querySelectorAll('*');
    allElements.forEach((child) => {
      if (child instanceof HTMLElement) {
        convertInlineStyles(child);
      }
    });
    
    console.log('After conversion:');
    console.log('Main element color:', testElement.style.color);
    console.log('Main element background:', testElement.style.backgroundColor);
    console.log('Child element color:', (testElement.firstChild as HTMLElement)?.style.color);
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">PDF Export Color Conversion Test</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Test Color Samples:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {testColors.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 border rounded"
                  style={{ backgroundColor: color }}
                />
                <code className="text-xs">{color}</code>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleTestConversion}
            variant="outline" 
            size="sm"
          >
            Test Color Parsing
          </Button>
          <Button 
            onClick={handleTestElement}
            variant="outline" 
            size="sm"
          >
            Test Element Conversion
          </Button>
        </div>
        
        <div className="text-xs text-gray-500">
          Open the browser console to see test results
        </div>
      </div>
    </div>
  );
};

export default PDFExportColorTest;