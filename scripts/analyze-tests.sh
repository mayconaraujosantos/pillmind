#!/bin/bash
# Script para listar todos os testes que podem ser refatorados

echo "=========================================="
echo "📊 ANÁLISE DE TESTES PARA REFATORAÇÃO"
echo "=========================================="
echo ""

# Encontrar todos os arquivos de teste
TEST_FILES=$(find src -name "*.test.tsx" -o -name "*.test.ts")
TOTAL_FILES=$(echo "$TEST_FILES" | wc -l)

echo "📁 Total de arquivos de teste encontrados: $TOTAL_FILES"
echo ""

echo "=========================================="
echo "1️⃣  ARQUIVOS COM 'renderWithTheme' LOCAL"
echo "=========================================="
echo "(Podem usar renderWithTheme global)"
echo ""
grep -l "const renderWithTheme" $TEST_FILES 2>/dev/null | while read file; do
    COUNT=$(grep -c "const renderWithTheme" "$file")
    echo "  ✓ $file ($COUNT ocorrência(s))"
done
echo ""

echo "=========================================="
echo "2️⃣  ARQUIVOS COM 'renderWithProviders' LOCAL"
echo "=========================================="
echo "(Podem usar renderWithProviders/renderWithCustomProviders global)"
echo ""
grep -l "const renderWith" $TEST_FILES 2>/dev/null | grep -v "renderWithTheme" | while read file; do
    COUNT=$(grep -c "const renderWith" "$file")
    echo "  ✓ $file ($COUNT ocorrência(s))"
done
echo ""

echo "=========================================="
echo "3️⃣  MOCKS REPETIDOS QUE PODEM SER GLOBALIZADOS"
echo "=========================================="
echo ""

echo "  📌 SafeAreaContext Mock:"
grep -l "jest.mock('react-native-safe-area-context'" $TEST_FILES 2>/dev/null | wc -l | xargs echo "    Encontrado em X arquivos:"
grep -l "jest.mock('react-native-safe-area-context'" $TEST_FILES 2>/dev/null | head -3 | while read file; do
    echo "      • $file"
done
echo ""

echo "  📌 useAuth Mock:"
grep -l "jest.mock.*useAuth" $TEST_FILES 2>/dev/null | wc -l | xargs echo "    Encontrado em X arquivos:"
grep -l "jest.mock.*useAuth" $TEST_FILES 2>/dev/null | head -3 | while read file; do
    echo "      • $file"
done
echo ""

echo "  📌 useTranslation Mock:"
grep -l "jest.mock.*i18n" $TEST_FILES 2>/dev/null | wc -l | xargs echo "    Encontrado em X arquivos:"
grep -l "jest.mock.*i18n" $TEST_FILES 2>/dev/null | head -3 | while read file; do
    echo "      • $file"
done
echo ""

echo "=========================================="
echo "4️⃣  OPORTUNIDADES DE REFATORAÇÃO"
echo "=========================================="
echo ""
echo "  [ALTA PRIORIDADE]"
echo "    • Refatorar 10 arquivos com renderWithTheme"
grep -l "const renderWithTheme" $TEST_FILES 2>/dev/null | while read file; do
    SIZE=$(wc -l < "$file")
    echo "      → $file ($SIZE linhas)"
done
echo ""

echo "  [MÉDIA PRIORIDADE]"
echo "    • Refatorar mocks de hooks específicos"
echo "    • Consolidar factories em mocks.ts"
echo ""

echo "=========================================="
echo "💾 ESTATÍSTICAS"
echo "=========================================="
TOTAL_TEST_LINES=$(cat $TEST_FILES | wc -l)
LINES_OF_SETUP=$(grep -r "jest.mock\|const renderWith\|SafeAreaProvider" src --include="*.test.tsx" --include="*.test.ts" | wc -l)

echo "  Total de linhas em testes: $TOTAL_TEST_LINES"
echo "  Linhas de setup/mocks: ~$LINES_OF_SETUP (estimado)"
echo "  Potencial de redução: 40-60%"
echo ""
echo "=========================================="
